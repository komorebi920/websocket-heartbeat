const WS_MODE = {
  MESSAGE: "MESSAGE",
  HEART_BEAT: "HEART_BEAT",
};

class Ws extends WebSocket {
  constructor(url, wsReConnect) {
    super(url);
    this.heartBeatTimer = null;
    this.reconnectTimer = null;
    this.wsUrl = url;
    this.wsReConnect = wsReConnect;

    this.init();
  }

  init() {
    this.bindEvent();
  }

  bindEvent() {
    this.addEventListener("open", this.handleOpen, false);
    this.addEventListener("close", this.handleClose, false);
    this.addEventListener("error", this.handleError, false);
    this.addEventListener("message", this.handleMessage, false);
  }

  handleOpen() {
    console.log("--- Client is connected ---");

    this.startHeartBeat();
  }

  handleClose() {
    console.log("--- Client is closed ---");

    if (this.heartBeatTimer) {
      clearInterval(this.heartBeatTimer);
      this.heartBeatTimer = null;
    }

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    this.reconnect();
  }

  handleError(error) {
    console.log("--- Client occured error ---", error);

    this.reconnect();
  }

  handleMessage(data) {
    const { mode, msg } = this.receiveMsg(data);

    switch (mode) {
      case WS_MODE.HEART_BEAT:
        console.log("--- HEART_BEAT ---", msg);
        break;
      case WS_MODE.MESSAGE:
        console.log("--- MESSAGE ---", msg);
        break;
      default:
        break;
    }
  }

  startHeartBeat() {
    this.heartBeatTimer = setInterval(() => {
      if (this.readyState === 1) {
        this.sendMsg({
          mode: WS_MODE.HEART_BEAT,
          msg: "HeartBeat",
        });
      } else {
        clearInterval(this.heartBeatTimer);
        this.heartBeatTimer = null;
      }

      this.waitForResponse();
    }, 4000);
  }

  reconnect() {
    this.reconnectTimer = setTimeout(() => {
      this.wsReConnect();
    }, 3000);
  }

  receiveMsg({ data }) {
    return JSON.parse(data);
  }

  waitForResponse() {
    setTimeout(() => {
      this.close();
    }, 2000);
  }

  sendMsg(data) {
    this.readyState === 1 && this.send(JSON.stringify(data));
  }

  static create(url, wsReConnect) {
    return new Ws(url, wsReConnect);
  }
}

export default Ws;
