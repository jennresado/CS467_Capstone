const db = require("../db/dbconfig");

module.exports = {
  addUser,
  editUser,
  getUserBy,
  deleteUser,
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

//returns user object corresponding to the given filter and filter value
async function getUserBy(filterName, filterValue) {
  switch (filterName) {
    case "username":
      return db("users").where({ username: filterValue });
    case "user_id":
      return db("users").where({ user_id: filterValue });
  }
}

//removes user with given id from database and returns the number of records changed
function deleteUser(user_id) {
  return db("users").del().where({ user_id });
}
