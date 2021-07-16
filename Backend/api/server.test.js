const supertest = require("supertest");
const server = require("./server");
const db = require("../db/dbconfig");
const fs = require('fs');
const atob = require('atob')
const {getTestAnimals, getExpectedTestAnimals, asyncForEach} = require('../animals/animalsModel.test')

describe("server", () => {
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

  describe("GET /", () => {
    it("returns 200 OK", async () => {
      const res = await supertest(server).get("/");
      expect(res.status).toBe(200);
    });

    it("returns json object {server: working}", async () => {
      const res = await supertest(server).get("/");
      expect(res.body.server).toBe("working");
    });
  });

  describe("Authorization", () => {
    describe("POST /register", () => {
      it("adds a new user to an empty db", async () => {
        const users = await db("users");
        expect(users).toHaveLength(0);

        await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          first_name: "Sam",
          last_name: "Gamgee",
          email: "baggins@gmail.com",
          admin: false,
        });

        const newUsers = await db("users");
        expect(newUsers).toHaveLength(1);
      });

      it("adds a new user to a db with users in it", async () => {
        const users = await db("users");
        expect(users).toHaveLength(0);

        await db("users").insert({
          username: "pippin",
          password: "pass",
          first_name: "Pippin",
          last_name: "Took",
          email: "Took@gmail.com",
          admin: false,
        });
        await db("users").insert({
          username: "frodo",
          password: "pass",
          first_name: "Frodo",
          last_name: "Baggins",
          email: "baggins@gmail.com",
          admin: false,
        });
        await db("users").insert({
          username: "merry",
          password: "pass",
          first_name: "Merry",
          last_name: "Took",
          email: "tookM@gmail.com",
          admin: false,
        });

        await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          first_name: "Sam",
          last_name: "Gamgee",
          email: "gamgee@gmail.com",
          admin: false,
        });

        const newUsers = await db("users");
        expect(newUsers).toHaveLength(4);
      });

      it("returns 201 OK when user is created sucessfully", async () => {
        const res = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          first_name: "Sam",
          last_name: "Gamgee",
          email: "gamgee@gmail.com",
          admin: false,
        });

        expect(res.status).toBe(201);
      });

      it("returns token and admin status", async () => {
        const res = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          first_name: "Sam",
          last_name: "Gamgee",
          email: "gamgee@gmail.com",
          admin: false,
        });

        expect(res.body.token).not.toBeNull();
        expect(res.body.admin).toBe(false)
      });

      it("returns 400 when user has no username", async () => {
        const res = await supertest(server).post("/auth/register").send({
          password: "pass",
        });

        expect(res.status).toBe(400);
      });

      it("returns an error message in res.body when user has no username", async () => {
        const res = await supertest(server).post("/auth/register").send({
          password: "pass",
        });

        expect(res.body.error).toBe(
          "The request object is missing one or more required attributes",
        );
      });

      it("returns 400 when user has no password", async () => {
        const res = await supertest(server).post("/auth/register").send({
          username: "sam",
        });

        expect(res.status).toBe(400);
      });

      it("returns an error message in res.body when user has no password", async () => {
        const res = await supertest(server).post("/auth/register").send({
          username: "pass",
        });

        expect(res.body.error).toBe(
          "The request object is missing one or more required attributes",
        );
      });

      it("returns 400 when user has no username and no password ", async () => {
        const res = await supertest(server).post("/auth/register").send({});

        expect(res.status).toBe(400);
      });

      it("returns an error message in res.body when user has no username and no password", async () => {
        const res = await supertest(server).post("/auth/register").send({});

        expect(res.body.error).toBe(
          "The request object is missing one or more required attributes",
        );
      });
    });

    describe("POST /login", () => {
      it("returns 200 OK when logging in successfully", async () => {
        await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          first_name: "Sam",
          last_name: "Gamgee",
          email: "baggins@gmail.com",
          admin: false,
        });

        const res = await supertest(server).post("/auth/login").send({
          username: "sam",
          password: "pass",
        });

        expect(res.status).toBe(200);
      });

      it("returns Welcome message in res.body when logging in successfully", async () => {
        await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          first_name: "Sam",
          last_name: "Gamgee",
          email: "baggins@gmail.com",
          admin: false,
        });

        const res = await supertest(server).post("/auth/login").send({
          username: "sam",
          password: "pass",
        });

        expect(res.body.message).toBe("Welcome");
      });

      it("returns token in res.body when logging in successfully", async () => {
        await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          first_name: "Sam",
          last_name: "Gamgee",
          email: "baggins@gmail.com",
          admin: false,
        });

        const res = await supertest(server).post("/auth/login").send({
          username: "sam",
          password: "pass",
        });

        expect(res.body.token).not.toBeNull();
      });

      it("returns 400 when no username is provided", async () => {
        await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          first_name: "Sam",
          last_name: "Gamgee",
          email: "baggins@gmail.com",
          admin: false,
        });

        const res = await supertest(server).post("/auth/login").send({
          password: "pass",
        });

        expect(res.status).toBe(400);
      });

      it("returns error message in res.body when no username is provided", async () => {
        await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          first_name: "Sam",
          last_name: "Gamgee",
          email: "baggins@gmail.com",
          admin: false,
        });

        const res = await supertest(server).post("/auth/login").send({
          password: "pass",
        });

        expect(res.body.error).toBe(
          "The request object is missing one or more required attributes",
        );
      });

      it("returns 400 when no password is provided", async () => {
        await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          first_name: "Sam",
          last_name: "Gamgee",
          email: "baggins@gmail.com",
          admin: false,
        });

        const res = await supertest(server).post("/auth/login").send({
          username: "pass",
        });

        expect(res.status).toBe(400);
      });

      it("returns error message in res.body when no password is provided", async () => {
        await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          first_name: "Sam",
          last_name: "Gamgee",
          email: "baggins@gmail.com",
          admin: false,
        });

        const res = await supertest(server).post("/auth/login").send({
          username: "pass",
        });

        expect(res.body.error).toBe(
          "The request object is missing one or more required attributes",
        );
      });

      it("returns 400 when no username and no password are provided", async () => {
        await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          first_name: "Sam",
          last_name: "Gamgee",
          email: "baggins@gmail.com",
          admin: false,
        });

        const res = await supertest(server).post("/auth/login").send({});

        expect(res.status).toBe(400);
      });

      it("returns error message in res.body when no username and no password are provided", async () => {
        await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          first_name: "Sam",
          last_name: "Gamgee",
          email: "baggins@gmail.com",
          admin: false,
        });

        const res = await supertest(server).post("/auth/login").send({});

        expect(res.body.error).toBe(
          "The request object is missing one or more required attributes",
        );
      });
    });
  });

  describe('AnimalsRouter', ()=>{
    describe('GET /animals', ()=>{
      it('gets an empty array when no animals are in database', async ()=>{
        const res = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          first_name: "Sam",
          last_name: "Gamgee",
          email: "baggins@gmail.com",
          admin: false,
        });
        const token = res.body.token;

        const resA = await supertest(server).get('/animals').set('authorization', token);

        expect(resA.body.animals).toHaveLength(0)
        expect(resA.body.animals).toEqual([])
      })

      it('gets a  non-empty array when database is populated with animals', async ()=>{
        const res = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          first_name: "Sam",
          last_name: "Gamgee",
          email: "baggins@gmail.com",
          admin: false,
        });
        const token = res.body.token;

        const testAnimals = await getTestAnimals();
        await asyncForEach(testAnimals, async (animal) => {
          await db('animals').insert(animal)
        })

        const expectedAnimals = await getExpectedTestAnimals();

        const resA = await supertest(server).get('/animals').set('authorization', token);
        let animals = resA.body.animals;

        await asyncForEach(animals, async(animal) => {
          animal.pic = atob(animal.pic);
        })

        expect(animals).toHaveLength(4)
      })
    })

    describe('PUT /animals/:animal_id', ()=>{
      it('edits the information of an animals based on the animal_id passed in the url', async ()=>{
        const res = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          first_name: "Sam",
          last_name: "Gamgee",
          email: "baggins@gmail.com",
          admin: false,
        });
        const token = res.body.token;

        const testAnimals = await getTestAnimals();
        await asyncForEach(testAnimals, async (animal) => {
          await db('animals').insert(animal)
        })

        const expectedAnimals = await getExpectedTestAnimals();
        let expectedAnimal = expectedAnimals[0]

        const newDes = 'A wonderful dog to have in the family.'
        expectedAnimal.description = newDes;

        const res2 = await supertest(server).put("/animals/1").set('authorization', token).send({
          description: newDes
        })

        const dbAnmials = await db('animals');
        for(let i = 0; i < dbAnmials.length; i++){
          if(dbAnmials[i].animal_id === expectedAnimal.animal_id){
            dbAnmials[i].pic = atob(dbAnmials[i].pic)
            expect(dbAnmials[i]).toEqual(expectedAnimal);
          }
        }
        

      })

      it('sends 200 OK when successfully edits an animal', async ()=>{
        const res = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          first_name: "Sam",
          last_name: "Gamgee",
          email: "baggins@gmail.com",
          admin: false,
        });
        const token = res.body.token;

        const testAnimals = await getTestAnimals();
        await asyncForEach(testAnimals, async (animal) => {
          await db('animals').insert(animal)
        })

        const expectedAnimals = await getExpectedTestAnimals();
        let expectedAnimal = expectedAnimals[0]

        const newDes = 'A wonderful dog to have in the family.'
        expectedAnimal.description = newDes;

        const res2 = await supertest(server).put("/animals/1").set('authorization', token).send({
          description: newDes
        })

        expect(res2.status).toBe(200);
      })

      it('sends a success message after succesful edit', async ()=>{
        const res = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          first_name: "Sam",
          last_name: "Gamgee",
          email: "baggins@gmail.com",
          admin: false,
        });
        const token = res.body.token;

        const testAnimals = await getTestAnimals();
        await asyncForEach(testAnimals, async (animal) => {
          await db('animals').insert(animal)
        })

        const expectedAnimals = await getExpectedTestAnimals();
        let expectedAnimal = expectedAnimals[0]

        const newDes = 'A wonderful dog to have in the family.'
        expectedAnimal.description = newDes;

        const res2 = await supertest(server).put("/animals/1").set('authorization', token).send({
          description: newDes
        })

        expect(res2.body.message).toBe("Edited 1 animal(s) successfully")
      })

      it('sends error message when no body is sent', async ()=>{
        const res = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          first_name: "Sam",
          last_name: "Gamgee",
          email: "baggins@gmail.com",
          admin: false,
        });
        const token = res.body.token;

        const testAnimals = await getTestAnimals();
        await asyncForEach(testAnimals, async (animal) => {
          await db('animals').insert(animal)
        })

        const expectedAnimals = await getExpectedTestAnimals();
        let expectedAnimal = expectedAnimals[0]

        const res2 = await supertest(server).put("/animals/1").set('authorization', token).send({})

        expect(res2.body.error).toBe("The request object is missing one or more required attributes")
      })

      it('sends error message when body is sent with wrong data type', async ()=>{
        const res = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          first_name: "Sam",
          last_name: "Gamgee",
          email: "baggins@gmail.com",
          admin: false,
        });
        const token = res.body.token;

        const testAnimals = await getTestAnimals();
        await asyncForEach(testAnimals, async (animal) => {
          await db('animals').insert(animal)
        })

        const expectedAnimals = await getExpectedTestAnimals();
        let expectedAnimal = expectedAnimals[0]

        const res2 = await supertest(server).put("/animals/1").set('authorization', token).send({
          description: 123
        })

        expect(res2.body.error).toBe("The request object attributes have one or more of the wrong type")

        const res3 = await supertest(server).put("/animals/1").set('authorization', token).send({
          news_item: 123
        })

        expect(res3.body.error).toBe("The request object attributes have one or more of the wrong type")

        const res4 = await supertest(server).put("/animals/1").set('authorization', token).send({
          pic: 123
        })

        expect(res4.body.error).toBe("The request object attributes have one or more of the wrong type")

        const res5 = await supertest(server).put("/animals/1").set('authorization', token).send({
          date: 123
        })

        expect(res5.body.error).toBe("The request object attributes have one or more of the wrong type")
      })

      it('sends status code 400 when body is sent with wrong data type', async ()=>{
        const res = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          first_name: "Sam",
          last_name: "Gamgee",
          email: "baggins@gmail.com",
          admin: false,
        });
        const token = res.body.token;

        const testAnimals = await getTestAnimals();
        await asyncForEach(testAnimals, async (animal) => {
          await db('animals').insert(animal)
        })

        const expectedAnimals = await getExpectedTestAnimals();
        let expectedAnimal = expectedAnimals[0]

        const res2 = await supertest(server).put("/animals/1").set('authorization', token).send({
          description: 123
        })

        expect(res2.status).toBe(400)

        const res3 = await supertest(server).put("/animals/1").set('authorization', token).send({
          news_item: 123
        })

        expect(res3.status).toBe(400)

        const res4 = await supertest(server).put("/animals/1").set('authorization', token).send({
          pic: 123
        })

        expect(res4.status).toBe(400)

        const res5 = await supertest(server).put("/animals/1").set('authorization', token).send({
          date: 123
        })

        expect(res5.status).toBe(400)
      })

    })

    describe('POST /animals', ()=>{
      it('adds a new animal to the database', async ()=>{
        const res = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          first_name: "Sam",
          last_name: "Gamgee",
          email: "baggins@gmail.com",
          admin: false,
        });
        const token = res.body.token;

        const testAnimals = await getTestAnimals();
        let animalList = [testAnimals[1], testAnimals[2], testAnimals[3]]
        await asyncForEach(animalList, async (animal) => {
          await db('animals').insert(animal)
        })

        const expectedAnimals = await getExpectedTestAnimals();
        let expectedAnimal = expectedAnimals[0]
        delete expectedAnimal.animal_id

        let testAnimal = testAnimals[0]
        delete testAnimal.animal_id

        const res2 = await supertest(server).post("/animals").set('authorization', token).send(testAnimal)

        const dbAnmials = await db('animals');
        expect(dbAnmials.length).toBe(4)

        dbAnmials.forEach(animal => {
          if (animal.description === expectedAnimal.description){
            expect(animal.date_created).toEqual(expectedAnimal.date_created)
            expect(animal.news_item).toBe(expectedAnimal.news_item)
            expect(atob(animal.pic)).toBe(expectedAnimal.pic)
          }
        })
      })

      it('sends 201 created when new animal added to database', async ()=>{
        const res = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          first_name: "Sam",
          last_name: "Gamgee",
          email: "baggins@gmail.com",
          admin: false,
        });
        const token = res.body.token;

        const testAnimals = await getTestAnimals();
        let animalList = [testAnimals[1], testAnimals[2], testAnimals[3]]
        await asyncForEach(animalList, async (animal) => {
          await db('animals').insert(animal)
        })

        const expectedAnimals = await getExpectedTestAnimals();
        let expectedAnimal = expectedAnimals[0]
        delete expectedAnimal.animal_id

        let testAnimal = testAnimals[0]
        delete testAnimal.animal_id

        const res2 = await supertest(server).post("/animals").set('authorization', token).send(testAnimal)

        expect(res2.status).toBe(201)
      })

      it('sends new animal_id in body of json response when adding new animal to database', async ()=>{
        const res = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          first_name: "Sam",
          last_name: "Gamgee",
          email: "baggins@gmail.com",
          admin: false,
        });
        const token = res.body.token;

        const testAnimals = await getTestAnimals();
        let animalList = [testAnimals[1], testAnimals[2], testAnimals[3]]
        await asyncForEach(animalList, async (animal) => {
          await db('animals').insert(animal)
        })

        const expectedAnimals = await getExpectedTestAnimals();
        let expectedAnimal = expectedAnimals[0]
        delete expectedAnimal.animal_id

        let testAnimal = testAnimals[0]
        delete testAnimal.animal_id

        const res2 = await supertest(server).post("/animals").set('authorization', token).send(testAnimal)

        expect(res2.body.animal).toBe(4)
      })

      it('error message when no body is sent', async ()=>{
        const res = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          first_name: "Sam",
          last_name: "Gamgee",
          email: "baggins@gmail.com",
          admin: false,
        });
        const token = res.body.token;

        const testAnimals = await getTestAnimals();
        let animalList = [testAnimals[1], testAnimals[2], testAnimals[3]]
        await asyncForEach(animalList, async (animal) => {
          await db('animals').insert(animal)
        })

        const res2 = await supertest(server).post("/animals").set('authorization', token).send()

        expect(res2.body.error).toEqual('The request object is missing one or more required attributes')
      })

      it('sends 400 status when no body sent', async ()=>{
        const res = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          first_name: "Sam",
          last_name: "Gamgee",
          email: "baggins@gmail.com",
          admin: false,
        });
        const token = res.body.token;

        const testAnimals = await getTestAnimals();
        let animalList = [testAnimals[1], testAnimals[2], testAnimals[3]]
        await asyncForEach(animalList, async (animal) => {
          await db('animals').insert(animal)
        })

        const res2 = await supertest(server).post("/animals").set('authorization', token).send()

        expect(res2.status).toBe(400)
      })

      it('error message when attribute has wrong data types', async ()=>{
        const res = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          first_name: "Sam",
          last_name: "Gamgee",
          email: "baggins@gmail.com",
          admin: false,
        });
        const token = res.body.token;

        const testAnimals = await getTestAnimals();
        let animalList = [testAnimals[1], testAnimals[2], testAnimals[3]]
        await asyncForEach(animalList, async (animal) => {
          await db('animals').insert(animal)
        })

        let testAnimal = testAnimals[0]
        delete testAnimal.animal_id

        testAnimal.date_created = 123

        const res2 = await supertest(server).post("/animals").set('authorization', token).send(testAnimal)

        expect(res2.body.error).toEqual('The request object attributes have one or more of the wrong type')

        testAnimal = testAnimals[0]
        delete testAnimal.animal_id

        testAnimal.description = 1234

        const res3 = await supertest(server).post("/animals").set('authorization', token).send(testAnimal)

        expect(res3.body.error).toEqual('The request object attributes have one or more of the wrong type')

        testAnimal = testAnimals[0]
        delete testAnimal.animal_id

        testAnimal.news_item = 1234

        const res4 = await supertest(server).post("/animals").set('authorization', token).send(testAnimal)

        expect(res4.body.error).toEqual('The request object attributes have one or more of the wrong type')

        testAnimal = testAnimals[0]
        delete testAnimal.animal_id

        testAnimal.pic = 1234

        const res5 = await supertest(server).post("/animals").set('authorization', token).send(testAnimal)

        expect(res5.body.error).toEqual('The request object attributes have one or more of the wrong type')
      })

      it('adds a date when date_created is missing on the animal object', async ()=>{
        const res = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          first_name: "Sam",
          last_name: "Gamgee",
          email: "baggins@gmail.com",
          admin: false,
        });
        const token = res.body.token;

        const testAnimals = await getTestAnimals();
        let animalList = [testAnimals[1], testAnimals[2], testAnimals[3]]
        await asyncForEach(animalList, async (animal) => {
          await db('animals').insert(animal)
        })

        const expectedAnimals = await getExpectedTestAnimals();
        let expectedAnimal = expectedAnimals[0]
        delete expectedAnimal.animal_id

        let testAnimal = testAnimals[0]
        delete testAnimal.animal_id
        delete testAnimal.date_created

        const res2 = await supertest(server).post("/animals").set('authorization', token).send(testAnimal)

        const dbAnmials = await db('animals');
        expect(dbAnmials.length).toBe(4)

        dbAnmials.forEach(animal => {
          if (animal.description === expectedAnimal.description){
            expect(animal.date_created).not.toEqual(expectedAnimal.date_created)
            expect(animal.news_item).toBe(expectedAnimal.news_item)
            expect(atob(animal.pic)).toBe(expectedAnimal.pic)
          }
        })
      })
    })

    describe.only('/GET /animals/:filter_name/:filter_value', ()=>{
      it('gets animal by animal_id', async ()=>{
        const res = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          first_name: "Sam",
          last_name: "Gamgee",
          email: "baggins@gmail.com",
          admin: false,
        });
        const token = res.body.token;

        const animalList = await getTestAnimals();
        await asyncForEach(animalList, async (animal) => {
          await db('animals').insert(animal)
        })

        const expectedAnimals = await getExpectedTestAnimals();


        const res2 = await supertest(server).get("/animals/animal_id/1").set('authorization', token)

        expect((res2.body.animalArr).length).toBe(1);

        let animal = res2.body.animalArr[0]
        animal.pic = atob(animal.pic)

        expect(animal.pic).toEqual(expectedAnimals[0].pic)
        expect(animal.description).toEqual(expectedAnimals[0].description)

      })

      it('gets animal by date_created', async ()=>{
        const res = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          first_name: "Sam",
          last_name: "Gamgee",
          email: "baggins@gmail.com",
          admin: false,
        });
        const token = res.body.token;

        const animalList = await getTestAnimals();
        await asyncForEach(animalList, async (animal) => {
          await db('animals').insert(animal)
        })

        const expectedAnimals = await getExpectedTestAnimals();


        const res2 = await supertest(server).get("/animals/date/06-20-2021").set('authorization', token)

        expect((res2.body.animalArr).length).toBe(1);

        let animal = res2.body.animalArr[0]
        animal.pic = atob(animal.pic)

        expect(animal.pic).toEqual(expectedAnimals[0].pic)
        expect(animal.description).toEqual(expectedAnimals[0].description)

      })

      it('returns empty array when given filter_name it does not recognize', async ()=>{
        const res = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          first_name: "Sam",
          last_name: "Gamgee",
          email: "baggins@gmail.com",
          admin: false,
        });
        const token = res.body.token;

        const animalList = await getTestAnimals();
        await asyncForEach(animalList, async (animal) => {
          await db('animals').insert(animal)
        })

        const res2 = await supertest(server).get("/animals/something/else").set('authorization', token)

        expect((res2.body.animalArr).length).toBe(0);
        expect(res2.body.animalArr).toEqual([]);

      })
    })

    describe('DELETE /animals/animal_id', ()=>{
      it('deletes animal from database', async ()=>{
        const res = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          first_name: "Sam",
          last_name: "Gamgee",
          email: "baggins@gmail.com",
          admin: false,
        });
        const token = res.body.token;

        const testAnimals = await getTestAnimals();
        await asyncForEach(testAnimals, async (animal) => {
          await db('animals').insert(animal)
        })

        const res2 = await supertest(server).del("/animals/1").set('authorization', token)

        const dbAnmials = await db('animals');
        expect(dbAnmials.length).toBe(3)
      })

      it('sends 200 when successfully deletes animal from database', async ()=>{
        const res = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          first_name: "Sam",
          last_name: "Gamgee",
          email: "baggins@gmail.com",
          admin: false,
        });
        const token = res.body.token;

        const testAnimals = await getTestAnimals();
        await asyncForEach(testAnimals, async (animal) => {
          await db('animals').insert(animal)
        })

        const res2 = await supertest(server).del("/animals/1").set('authorization', token)

        expect(res2.status).toBe(200);
      })

      it('sends success message after successfully deletes animal from database', async ()=>{
        const res = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          first_name: "Sam",
          last_name: "Gamgee",
          email: "baggins@gmail.com",
          admin: false,
        });
        const token = res.body.token;

        const testAnimals = await getTestAnimals();
        await asyncForEach(testAnimals, async (animal) => {
          await db('animals').insert(animal)
        })

        const res2 = await supertest(server).del("/animals/1").set('authorization', token)

        expect(res2.body.message).toEqual("1 deleted successfully");
      })

      it('sends 404 when trying to delete animal with an animal_id not in the database', async ()=>{
        const res = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          first_name: "Sam",
          last_name: "Gamgee",
          email: "baggins@gmail.com",
          admin: false,
        });
        const token = res.body.token;

        const res2 = await supertest(server).del("/animals/1").set('authorization', token)

        expect(res2.status).toBe(404);
      })

      it('sends error message when trying to delete animal with an animal_id not in the database', async ()=>{
        const res = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          first_name: "Sam",
          last_name: "Gamgee",
          email: "baggins@gmail.com",
          admin: false,
        });
        const token = res.body.token;

        const res2 = await supertest(server).del("/animals/1").set('authorization', token)

        expect(res2.body.message).toEqual('No animal with that id was found');
      })
    })
  })
});
