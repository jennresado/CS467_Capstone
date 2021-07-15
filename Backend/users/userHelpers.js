module.exports = {
  validateUser,
  validateUserEdit,
};

function validateUser(req, res, next) {
  let user = req.body;

  if (
    user.username &&
    user.password &&
    user.first_name &&
    user.last_name &&
    user.email &&
    (user.admin || !user.admin)
  ) {
    if (typeof user.username !== "string") {
      return res.status(400).json({
        error:
          "The request object attributes have one or more of the wrong type",
        stack: "User helpers line 21",
      });
    }

    if (typeof user.password !== "string") {
      return res.status(400).json({
        error:
          "The request object attributes have one or more of the wrong type",
        stack: "User helpers line 29",
      });
    }

    if (typeof user.first_name !== "string") {
      return res.status(400).json({
        error:
          "The request object attributes have one or more of the wrong type",
        stack: "User helpers line 37",
      });
    }

    if (typeof user.last_name !== "string") {
      return res.status(400).json({
        error:
          "The request object attributes have one or more of the wrong type",
        stack: "User helpers line 45",
      });
    }

    if (typeof user.email !== "string") {
      return res.status(400).json({
        error:
          "The request object attributes have one or more of the wrong type",
        stack: "User helpers line 53",
      });
    }

    if (user.admin !== true && user.admin !== false) {
      user.admin = false
    }

    next();
  } else {
    return res.status(400).json({
      error: "The request object is missing one or more required attributes",
      stack: "User helpers line 68",
    });
  }
}

function validateUserEdit(req, res, next) {
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
          error:
            "The request object attributes have one or more of the wrong type",
        });
      }
    }

    if (user.password) {
      if (typeof user.password !== "string") {
        return res.status(400).json({
          error:
            "The request object attributes have one or more of the wrong type",
        });
      }
    }

    if (user.first_name) {
      if (typeof user.first_name !== "string") {
        return res.status(400).json({
          error:
            "The request object attributes have one or more of the wrong type",
        });
      }
    }

    if (user.last_name) {
      if (typeof user.last_name !== "string") {
        return res.status(400).json({
          error:
            "The request object attributes have one or more of the wrong type",
        });
      }
    }

    if (user.email) {
      if (typeof user.email !== "string") {
        return res.status(400).json({
          error:
            "The request object attributes have one or more of the wrong type",
        });
      }
    }

    next();
  } else {
    return res.status(400).json({
      error: "The request object is missing one or more required attributes",
    });
  }
}
