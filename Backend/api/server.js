const express = require("express");
const cors = require("cors");
const server = express();

//routers
const usersRouter = require("../users/usersRouter");

server.use(express.json());
server.use(cors());

server.use("/users", usersRouter);

server.get("/", (req, res) => {
  res.status(200).json({ server: "working" });
});

module.exports = server;
