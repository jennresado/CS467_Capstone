const router = require("express").Router();
const Users = require("./usersModel");

router.get("/", (req, res) => {
  const username = req.jwt.username;
  Users.getUserBy("username", username)
    .then((user) => {
      res.status(200).json({ user });
    })
    .catch((err) => {
      res.status(500).json({
        error: err.message,
        errorMessage: "Could not retrive that user",
        stack: "Users router line 16",
      });
    });
});

module.exports = router;
