const db = require("../db/dbconfig");
const Users = require("./usersModel");

//sample users to be used in tests
function getTestUsers() {
  const user1 = {
    username: "wolf",
    password: "pass",
    email: "something@gmail.com",
    first_name: "Wolf",
    last_name: "Kelly",
    admin: true,
  };

  const user2 = {
    username: "dragon",
    password: "pass",
    email: "something2@gmail.com",
    first_name: "A",
    last_name: "Dragon",
    admin: true,
  };

  const user3 = {
    username: "penguin",
    password: "pass",
    email: "something3@gmail.com",
    first_name: "Peppy",
    last_name: "Penguin",
    admin: false,
  };

  const user4 = {
    username: "sam",
    password: "pass",
    email: "something4@gmail.com",
    first_name: "Sam",
    last_name: "Gamgee",
  };

  return [user1, user2, user3, user4];
}

//what should be returned from the database
function getExpectedTestUsers() {
  return [
    {
      username: "wolf",
      password: "pass",
      email: "something@gmail.com",
      first_name: "Wolf",
      last_name: "Kelly",
      admin: true,
      user_id: 1,
    },
    {
      username: "dragon",
      password: "pass",
      email: "something2@gmail.com",
      first_name: "A",
      last_name: "Dragon",
      admin: true,
      user_id: 2,
    },
    {
      username: "penguin",
      password: "pass",
      email: "something3@gmail.com",
      first_name: "Peppy",
      last_name: "Penguin",
      admin: false,
      user_id: 3,
    },
    {
      username: "sam",
      password: "pass",
      email: "something4@gmail.com",
      first_name: "Sam",
      last_name: "Gamgee",
      admin: false,
      user_id: 4,
    },
  ];
}

//async forEach method
async function asyncForEach(array, cb) {
  for (let i = 0; i < array.length; i++) {
    await cb(array[i], i, array);
  }
}

describe("usersModel", () => {
  //wipes all tables in database clean so each test starts with empty tables
  beforeEach(async () => {
    //db is the knex initialized object using db.raw to truncate postgres tables with foreign keys
    //can use knex.raw but it is global and deprecated
    await db.raw("TRUNCATE TABLE animals RESTART IDENTITY CASCADE");
    await db.raw("TRUNCATE TABLE users RESTART IDENTITY CASCADE");
  });

  //adds users to the database
  describe("addUser", () => {
    it("adds a user to an empty db", async () => {
      let userList = getTestUsers();
      let dbTestUsers = getExpectedTestUsers();

      await Users.addUser(userList[0]);

      const users = await db("users");
      const shouldGet = [dbTestUsers[0]];

      expect(users).toHaveLength(1);
      expect(users).toEqual(shouldGet);
    });

    it("adds a user to a non-empty db", async () => {
      let list = getTestUsers();
      let userList = [list[0], list[1], list[2]];
      let dbTestUsers = getExpectedTestUsers();

      await asyncForEach(userList, async (user) => {
        await db("users").insert(user);
      });

      await Users.addUser(list[3]);
      const users = await db("users");

      expect(users).toHaveLength(4);
      expect(users).toEqual(dbTestUsers);
    });
  });
});
