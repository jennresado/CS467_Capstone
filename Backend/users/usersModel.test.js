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
    await db.raw("TRUNCATE TABLE user_animals RESTART IDENTITY CASCADE");
    await db.raw("TRUNCATE TABLE dispositions RESTART IDENTITY CASCADE");
    await db.raw("TRUNCATE TABLE animal_dispositions RESTART IDENTITY CASCADE");
    await db.raw("TRUNCATE TABLE breeds RESTART IDENTITY CASCADE");
    await db.raw("TRUNCATE TABLE animal_breeds RESTART IDENTITY CASCADE");
  });

  describe("addUser(user)", () => {
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

  describe("editUser(user_id, user)", () => {
    it("edits a user in a db with 1 entry", async () => {
      let users = getTestUsers();
      await db("users").insert(users[0]);
      const dbTestUsers = getExpectedTestUsers();

      const count = await Users.editUser(1, {
        email: "somethingElse@gmail.com",
      });

      let expectedUser1 = dbTestUsers[0];
      expectedUser1.email = "somethingElse@gmail.com";
      const user = await db("users");

      expect(count).toBe(1);
      expect(user).toEqual([expectedUser1]);
    });

    it("edits a user in a db with more than 1 entry", async () => {
      let users = getTestUsers();
      await db("users").insert(users[0]);
      await db("users").insert(users[1]);
      await db("users").insert(users[2]);
      await db("users").insert(users[3]);

      const count = await Users.editUser(3, {
        email: "somethingElse@gmail.com",
      });

      let expectedUsers = getExpectedTestUsers();
      //change the email to the edited one we supplied
      expectedUsers[2].email = "somethingElse@gmail.com";
      //change the email to the original email that was changed in previous test
      expectedUsers[0].email = "something@gmail.com";

      const dbusers = await db("users");

      expect(count).toBe(1);
      expect(dbusers).toEqual(expect.arrayContaining(expectedUsers));
    });
  });

  describe("getUserBy(filterName, filterValue)", () => {
    it("gets a list of users in a populated database by their user_id", async () => {
      let users = getTestUsers();
      let expectedUsers = getExpectedTestUsers();

      for (let i = 0; i < users.length; i++) {
        await db("users").insert(users[i]);
      }

      let dbUsers = await db("users");
      expect(dbUsers.length).toBe(4);
      expect(dbUsers).toEqual(expectedUsers);

      let user1 = await Users.getUserBy("user_id", 1);
      expect(user1).toEqual([expectedUsers[0]]);
    });

    it("returns empty array when trying to get user that's not in the database user their userid", async () => {
      let users = getTestUsers();

      for (let i = 0; i < users.length - 1; i++) {
        await db("users").insert(users[i]);
      }
      let dbUsers = await db("users");
      expect(dbUsers.length).toBe(3);

      let user4 = await Users.getUserBy("user_id", 4);
      expect(user4).toEqual([]);
    });

    it("gets a list of users in a populated database by their username", async () => {
      let users = getTestUsers();
      let expectedUsers = getExpectedTestUsers();

      for (let i = 0; i < users.length; i++) {
        await db("users").insert(users[i]);
      }

      let dbUsers = await db("users");
      expect(dbUsers.length).toBe(4);
      expect(dbUsers).toEqual(expectedUsers);

      let user1 = await Users.getUserBy("username", "wolf");
      expect(user1).toEqual([expectedUsers[0]]);
    });

    it("returns an empty array when trying to get user that's not in the database using their username", async () => {
      let users = getTestUsers();

      for (let i = 0; i < users.length - 1; i++) {
        await db("users").insert(users[i]);
      }
      let dbUsers = await db("users");
      expect(dbUsers.length).toBe(3);

      let user4 = await Users.getUserBy("username", "frodo");
      expect(user4).toEqual([]);
    });
  });

  describe("deleteUser(user_id)", () => {
    it("deletes single user from database holding only 1 user", async () => {
      let users = getTestUsers();

      await db("users").insert(users[0]);
      let dbUsers = await db("users");
      expect(dbUsers.length).toBe(1);

      const count = await Users.deleteUser(1);
      dbUsers = await db("users");

      expect(count).toBe(1);
      expect(dbUsers).toEqual([]);
    });

    it("deletes single user from populated database", async () => {
      let users = getTestUsers();
      let expectedUsers = getExpectedTestUsers();
      expectedUsers.shift();

      for (let i = 0; i < users.length; i++) {
        await db("users").insert(users[i]);
      }

      let dbUsers = await db("users");
      expect(dbUsers.length).toBe(4);

      const count = await Users.deleteUser(1);
      dbUsers = await db("users");

      expect(count).toBe(1);
      expect(dbUsers).toEqual(expectedUsers);
    });

    it("returns 0 when trying to delete a user that does not exist from populated database", async () => {
      let users = getTestUsers();
      let expectedUsers = getExpectedTestUsers();

      for (let i = 0; i < users.length; i++) {
        await db("users").insert(users[i]);
      }

      let dbUsers = await db("users");
      expect(dbUsers.length).toBe(4);

      const count = await Users.deleteUser(5);
      dbUsers = await db("users");

      expect(count).toBe(0);
      expect(dbUsers).toEqual(expectedUsers);
    });
  });
});
