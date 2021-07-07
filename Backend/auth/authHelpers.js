const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = {
  signToken,
  validLogin,
};

function signToken(user) {
  const payload = {
    subject: user.user_id,
    username: user.username,
  };

  const secret = process.env.JWT_SECRET;

  const options = {
    expiresIn: "1h",
  };
  return jwt.sign(payload, secret, options);
}

function validLogin(req, res, next) {
  let user = req.body;
  if (user.username && user.password) {
    if (typeof user.username !== "string") {
      return res.status(400).json({
        Error:
          "The request object attributes have one or more of the wrong type",
      });
    }

    if (typeof user.password !== "string") {
      return res.status(400).json({
        Error:
          "The request object attributes have one or more of the wrong type",
      });
    }

    next();
  } else {
    res.status(400).json({
      error: "The request object is missing one or more required attributes",
    });
  }
}
