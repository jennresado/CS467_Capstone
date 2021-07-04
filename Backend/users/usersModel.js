const db = require("../db/dbconfig");

module.exports = {
  addUser,
  //   editUser,
  //   getUserBy,
  //   deleteUser,
};

//adds a user to the database
function addUser(user) {
  return db("users").insert(user, "user_id");
}
