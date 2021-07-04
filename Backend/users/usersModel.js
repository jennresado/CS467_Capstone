const db = require("../db/dbconfig");

module.exports = {
  addUser,
  editUser,
  //   getUserBy,
  //   deleteUser,
};

//adds a user to the database
function addUser(user) {
  return db("users").insert(user, "user_id");
}

//edits user with the given id
function editUser(user_id, userEdits) {
  return db("users")
    .where({ user_id })
    .update(userEdits)
    .then((count) => {
      return count;
    });
}
