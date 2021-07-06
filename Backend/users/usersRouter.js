const router = require("express").Router();
const Users = require("./usersModel");
const helpers = require("./userHelpers");

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

router.put("/", helpers.validateUserEdit, (req, res) => {
  const username = req.jwt.username;
  const changes = req.body;

  Users.getUserBy("username", username)
    .then((user) => {
      if (user) {
        if (changes.admin) {
          if (!user.admin) {
            return res.status(401).json({
              message:
                "You are not authorized to change this status. Please contact an admin",
            });
          }
        }
        Users.editUser(user.user_id, changes)
          .then((count) => {
            res
              .status(200)
              .json({ message: `Edited ${count} user(s) successfully` });
          })
          .catch((err) => {
            res.status(500).json({
              error: err.message,
              errorMessage: "Could not edit that user",
              stack: "Users router line 44",
            });
          });
      } else {
        res.status(404).json({ message: "No user with that username exists" });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err.message,
        errorMessage: "Could not edit that user",
        stack: "Users router line 52",
      });
    });
});

router.delete("/", (req, res) => {
  const username = req.jwt.username;

  Users.getUserBy("username", username).then((user) => {
    Users.deleteUser(user.user_id)
      .then((delUser) => {
        res.status(200).json({ message: `${delUser} deleted successfully` });
      })
      .catch((err) => {
        res.status(404).json({ message: "No user with that username exists " });
      });
  });
});

module.exports = router;
