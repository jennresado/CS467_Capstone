const router = require("express").Router();
const Users = require("./usersModel");
const helpers = require("./userHelpers");
const bcryptjs = require("bcryptjs");
const { signToken, validLogin } = require("../auth/authHelpers");

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
    .then((userArr) => {
      const user = userArr[0];
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
            let new_token = "n/a"
            if (changes.username) {
              Users.getUserBy("username", changes.username).then(userArr => {
                const user = userArr[0]
                new_token = signToken(user)
                res
                  .status(200)
                  .json({ message: `Edited ${count} user(s) successfully`, new_token });
              })
            } else if (changes.password) {
              Users.getUserBy("username", username).then(userArr => {
                const user = userArr[0]
                new_token = signToken(user)
                res
                  .status(200)
                  .json({ message: `Edited ${count} user(s) successfully`, new_token });
              })
            } else {
              res
                .status(200)
                .json({ message: `Edited ${count} user(s) successfully` });
            }
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

  Users.getUserBy("username", username).then((userArr) => {
    const user = userArr[0];
    if (user) {
      Users.deleteUser(user.user_id)
        .then((delUser) => {
          res.status(200).json({ message: `${delUser} user deleted successfully` });
        })
        .catch((err) => {
          res.status(404).json({ message: "No user with that username exists " });
        });
    } else {
      res.status(404).json({ message: "No user with that username exists " });
    }

  });
});

module.exports = router;
