const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        res.status(401).json({ message: "Invalid token" });
      } else {
        req.jwt = decodedToken;
        next();
      }
    });
  } else {
    res.status(401).json({ message: "Invalid token" });
  }
};
