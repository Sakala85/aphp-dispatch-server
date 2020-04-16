const express = require("express");
const http = require("http");
const cors = require("cors");
const socketio = require("socket.io");
const socketControl = require("./socket/socketController");
const app = express();

app.use(cors());
const server = http.createServer(app);
const io = socketio(server);

socketControl.notificationSocket(io);

server.listen(process.env.PORT || 5000, () =>
<h1>Server is Up and running</h1>
);
