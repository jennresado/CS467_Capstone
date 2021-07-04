module.exports = {
  validateUser,
};

function validateUser(req, res, next) {
  let user = req.body;
  if (
    user.username ||
    user.password ||
    user.first_name ||
    user.last_name ||
    user.email
  ) {
    if (user.username) {
      if (typeof user.username !== "string") {
        return res.status(400).json({
          Error:
            "The request object attributes have one or more of the wrong type",
        });
      }
    }

    if (user.password) {
      if (typeof user.password !== "string") {
        return res.status(400).json({
          Error:
            "The request object attributes have one or more of the wrong type",
        });
      }
    }

    if (user.first_name) {
      if (typeof user.first_name !== "string") {
        return res.status(400).json({
          Error:
            "The request object attributes have one or more of the wrong type",
        });
      }
    }

    if (user.last_name) {
      if (typeof user.last_name !== "string") {
        return res.status(400).json({
          Error:
            "The request object attributes have one or more of the wrong type",
        });
      }
    }

    if (user.email) {
      if (typeof user.email !== "string") {
        return res.status(400).json({
          Error:
            "The request object attributes have one or more of the wrong type",
        });
      }
    }

    next();
  }
}
