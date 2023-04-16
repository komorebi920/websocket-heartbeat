const Websocket = require("ws");
const server = new Websocket.Server({ port: 3000 });

server.on("connection", handleConnection);

function handleConnection(ws) {
  ws.on("close", handleClose);
  ws.on("error", handleError);
  ws.on("message", handleMessage);
}

function handleClose() {
  console.log("--- Server is closed ---");
  this.send(JSON.stringify({ mode: "CLOSE", msg: "--- Server is closed ---" }));
}

function handleError(error) {
  console.log("--- Server occured error ---", error);
}

function handleMessage(data) {
  const { mode, msg } = JSON.parse(data);
  switch (mode) {
    case "MESSAGE":
      console.log("--- User message ---");
      this.send(JSON.stringify(JSON.parse(data)));
      break;
    case "HEART_BEAT":
      console.log("--- HeartBeat message ---");
      this.send(JSON.stringify(JSON.parse(data)));
      break;
  }
}
