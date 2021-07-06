const router = require("express").Router();
const bcryptjs = require("bcryptjs");
const Users = require("../users/usersModel");
const { validateUser } = require("../users/userHelpers");
const { signToken, validLogin } = require("./authHelpers");

router.post("/register", validateUser, (req, res) => {
  const user = req.body;

  const rounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
  const hash = bcryptjs.hashSync(user.password, rounds);
  user.password = hash;

  Users.addUser(user)
    .then(() => {
      const token = signToken(user);
      res.status(201).json({ message: "Welcome", token });
    })
    .catch((err) => {
      res.status(500).json({
        error: err.messsage,
        errorMessage: "Couldn't add the user to the database",
        stack: "Auth router line 36",
      });
    });
});

router.post("/login", validLogin, (req, res) => {
  const { username, password } = req.body;
  Users.getUserBy("username", username)
    .then((userArr) => {
      const user = userArr[0];
      if (user && bcryptjs.compareSync(password, user.password)) {
        const token = signToken(user);
        res.status(200).json({ message: "Welcome", token });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err.message,
        errorMessage: "Could not log in user",
        stack: "Auth router login line 57",
      });
    });
});

module.exports = router;
