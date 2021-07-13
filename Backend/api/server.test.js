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
  })
});
