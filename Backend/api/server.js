const express = require("express");
const cors = require("cors");
const server = express();

//routers
const authRouter = require("../auth/authRouter");
const auth = require("../auth/authMiddleware");
const usersRouter = require("../users/usersRouter");
const animalsRouter = require("../animals/animalsRouter");

const dummyRouter = require('../dummyRouter');

server.use(express.json({limit: '50mb'}));
server.use(cors());

server.use("/auth", authRouter);
server.use("/users", auth, usersRouter);
server.use("/animals", auth, animalsRouter);

server.use('/dummy/animals', auth, dummyRouter)

server.get("/", (req, res) => {
  res.status(200).json({ server: "working" });
});

module.exports = server;
