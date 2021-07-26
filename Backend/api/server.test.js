const supertest = require("supertest");
const server = require("./server");
const db = require("../db/dbconfig");
const { getTestAnimals, getExpectedTestAnimals, asyncForEach } = require('../animals/animalsModel.test')
const fs = require('fs')
const atob = require('atob')


//function to insert dispositions of animals 
async function insertAnimalDispositions() {
  await db('animal_dispositions').insert({ animal_id: 1, disposition_id: 1 })
  await db('animal_dispositions').insert({ animal_id: 1, disposition_id: 2 })
  await db('animal_dispositions').insert({ animal_id: 2, disposition_id: 2 })
  await db('animal_dispositions').insert({ animal_id: 2, disposition_id: 3 })
  await db('animal_dispositions').insert({ animal_id: 4, disposition_id: 1 })
  await db('animal_dispositions').insert({ animal_id: 4, disposition_id: 2 })
  await db('animal_dispositions').insert({ animal_id: 4, disposition_id: 3 })
}

//insert the animals needed
async function insertAnimals() {
  const animals = await getTestAnimals();
  await asyncForEach(animals, async (animal) => {
    delete animal.disposition
    delete animal.breeds;
    delete animal.type;
    delete animal.availability;
    await db('animals').insert(animal)
  })

}

//function to insert availabilities of animals 
async function insertAnimalAvail() {
  await db('animal_availability').insert({ animal_id: 1, availability_id: 2 });
  await db('animal_availability').insert({ animal_id: 2, availability_id: 3 });
  await db('animal_availability').insert({ animal_id: 3, availability_id: 1 });
  await db('animal_availability').insert({ animal_id: 4, availability_id: 3 });
}

//function to insert breeds of animals 
async function insertAnimalBreed() {
  await db('animal_breeds').insert({ animal_id: 1, breed_id: 3 })
  await db('animal_breeds').insert({ animal_id: 2, breed_id: 48 })
  await db('animal_breeds').insert({ animal_id: 2, breed_id: 37 })
  await db('animal_breeds').insert({ animal_id: 3, breed_id: 48 })
  await db('animal_breeds').insert({ animal_id: 4, breed_id: 3 })
  await db('animal_breeds').insert({ animal_id: 4, breed_id: 2 })
}

//function to insert types of animals
async function insertAnimalType() {
  await db('animal_type').insert({ animal_id: 1, type_id: 1 });
  await db('animal_type').insert({ animal_id: 4, type_id: 1 });
  await db('animal_type').insert({ animal_id: 2, type_id: 2 });
  await db('animal_type').insert({ animal_id: 3, type_id: 3 });
}



describe("server", () => {
  //wipes all tables in database clean so each test starts with empty tables
  beforeEach(async () => {
    //db is the knex initialized object using db.raw to truncate postgres tables with foreign keys
    //can use knex.raw but it is global and deprecated
    await db.raw("TRUNCATE TABLE animals RESTART IDENTITY CASCADE");
    await db.raw("TRUNCATE TABLE users RESTART IDENTITY CASCADE");
    await db.raw("TRUNCATE TABLE user_animals RESTART IDENTITY CASCADE");
    await db.raw("TRUNCATE TABLE breeds RESTART IDENTITY CASCADE");
    await db.raw("TRUNCATE TABLE animal_breeds RESTART IDENTITY CASCADE");
    await db.raw("TRUNCATE TABLE animal_dispositions RESTART IDENTITY CASCADE");
    await db.raw("TRUNCATE TABLE dispositions RESTART IDENTITY CASCADE");
    await db.raw("TRUNCATE TABLE animal_availability RESTART IDENTITY CASCADE");
    await db.raw("TRUNCATE TABLE availability RESTART IDENTITY CASCADE");
    await db.raw("TRUNCATE TABLE animal_type RESTART IDENTITY CASCADE");
    await db.raw("TRUNCATE TABLE types RESTART IDENTITY CASCADE");

    let disList = ["Good with children", "Good with other animals", "Animal must be leashed at all times"]
    await asyncForEach(disList, async (dis) => {
      await db('dispositions').insert({ disposition: dis })
    })

    let typeList = ['dog', 'cat', 'other']
    await asyncForEach(typeList, async (type) => {
      await db('types').insert({ type })
    })

    let availList = ["Not Available", "Available", "Pending", "Adopted"]
    await asyncForEach(availList, async (availability) => {
      await db('availability').insert({ availability })
    })

    let breedList = ["australian shepherd",
      "beagle",
      "border collie",
      "boston terrier",
      "boxer",
      "bulldog",
      "cavalier king charles spaniel",
      "chihuahua",
      "dachshund",
      "dalmatian",
      "dobermann",
      "french bulldog",
      "german shepherd",
      "golden retriever",
      "great dane",
      "labrador retriever",
      "miniature schnauzer",
      "mixed breed",
      "pembroke welsh corgi",
      "pomeranian",
      "poodle",
      "pug",
      "rottweiler",
      "shiba inu",
      "shih tzu",
      "siberian husky",
      "yorkshire terrier", "abyssinian",
      "american shorthair",
      "balinese cat",
      "bengal cat",
      "british longhair",
      "british shorthair",
      "chartreux",
      "himalayan cat",
      "himalayan cat",
      "maine coon",
      "mixed breed",
      "munchkin cat",
      "persian cat",
      "ragdoll",
      "russian blue",
      "scottish fold",
      "siamese cat",
      "snowshoe cat",
      "sphynx cat",
      "turkish angora",
      'other']
    await asyncForEach(breedList, async (breed) => {
      await db('breeds').insert({ breed })
    })
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

  describe("Authorization /auth", () => {
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
          admin: true,
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
          admin: true,
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
          admin: true,
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
          admin: true,
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
          admin: true,
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
          admin: true,
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
          admin: true,
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
          admin: true,
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
          admin: true,
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
          admin: true,
        });

        const res = await supertest(server).post("/auth/login").send({});

        expect(res.body.error).toBe(
          "The request object is missing one or more required attributes",
        );
      });
    });
  });

  describe('AnimalsRouter /animals', () => {
    describe('GET /', () => {
      it('gets an empty array when no animals are in database', async () => {
        const res = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          first_name: "Sam",
          last_name: "Gamgee",
          email: "baggins@gmail.com",
          admin: true
        });
        const token = res.body.token;

        const resA = await supertest(server).get('/animals').set('authorization', token);

        expect(resA.body.animals).toHaveLength(0)
        expect(resA.body.animals).toEqual([])
      })

      it('gets a  non-empty array when database is populated with animals', async () => {
        const res = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          first_name: "Sam",
          last_name: "Gamgee",
          email: "baggins@gmail.com",
          admin: true
        });
        const token = res.body.token;

        await insertAnimals();
        await insertAnimalAvail();
        await insertAnimalBreed();
        await insertAnimalDispositions();
        await insertAnimalType()

        const expectedAnimals = await getExpectedTestAnimals();

        const resA = await supertest(server).get('/animals').set('authorization', token);
        let animals = resA.body.animals;

        await asyncForEach(animals, async (animal) => {
          animal.disposition.sort()
        })

        expect(animals).toHaveLength(4)

        expect(animals[0].disposition).toEqual(expectedAnimals[0].disposition)
        expect(animals[0].breeds).toEqual(expectedAnimals[0].breeds)

        expect(animals[1].description).toEqual(expectedAnimals[1].description)
        expect(animals[1].type).toEqual(expectedAnimals[1].type)

        expect(animals[3].news_item).toEqual(expectedAnimals[3].news_item)
        expect(animals[3].availability).toEqual(expectedAnimals[3].availability)

      })
    })

    describe('GET /:filter_name/:filter_value', () => {
      it('gets animal by animal_id', async () => {
        const res = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          first_name: "Sam",
          last_name: "Gamgee",
          email: "baggins@gmail.com",
          admin: true
        });
        const token = res.body.token;

        await insertAnimals();
        await insertAnimalAvail();
        await insertAnimalBreed();
        await insertAnimalDispositions();
        await insertAnimalType()

        const expectedAnimals = await getExpectedTestAnimals();

        const res2 = await supertest(server).get("/animals/animal_id/1").set('authorization', token)

        expect((res2.body.animalArr).length).toBe(1);

        let animal = res2.body.animalArr[0]

        expect(animal.pic).toEqual(expectedAnimals[0].pic)
        expect(animal.description).toEqual(expectedAnimals[0].description)
        expect(animal.disposition).toEqual(expectedAnimals[0].disposition)

      })

      it('gets animal by date_created', async () => {
        const res = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          first_name: "Sam",
          last_name: "Gamgee",
          email: "baggins@gmail.com",
          admin: true
        });
        const token = res.body.token;

        await insertAnimals();
        await insertAnimalAvail();
        await insertAnimalBreed();
        await insertAnimalDispositions();
        await insertAnimalType()

        const expectedAnimals = await getExpectedTestAnimals();

        const res2 = await supertest(server).get("/animals/date/06-20-2021").set('authorization', token)

        expect((res2.body.animalArr).length).toBe(1);

        let animal = res2.body.animalArr[0]

        expect(animal.pic).toEqual(expectedAnimals[0].pic)
        expect(animal.description).toEqual(expectedAnimals[0].description)
        expect(animal.disposition).toEqual(expectedAnimals[0].disposition)

      })

      it('gets a list of animal_ids in a populated database by their disposition', async () => {
        const res = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          first_name: "Sam",
          last_name: "Gamgee",
          email: "baggins@gmail.com",
          admin: true
        });
        const token = res.body.token;

        await insertAnimals();
        await insertAnimalAvail();
        await insertAnimalBreed();
        await insertAnimalDispositions();
        await insertAnimalType()

        const expectedAnimals = await getExpectedTestAnimals();

        const res2 = await supertest(server).get("/animals/disposition/Good_with_other_animals").set('authorization', token)

        expect((res2.body.animalArr).length).toBe(3);

        let animal = res2.body.animalArr
        expect(animal).toEqual([{ animal_id: 1 }, { animal_id: 2 }, { animal_id: 4 }])
      })

      it('gets a list of animal_ids in a populated database by their type', async () => {
        const res = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          first_name: "Sam",
          last_name: "Gamgee",
          email: "baggins@gmail.com",
          admin: true
        });
        const token = res.body.token;

        await insertAnimals();
        await insertAnimalAvail();
        await insertAnimalBreed();
        await insertAnimalDispositions();
        await insertAnimalType()

        const expectedAnimals = await getExpectedTestAnimals();

        const res2 = await supertest(server).get("/animals/type/dog").set('authorization', token)

        expect((res2.body.animalArr).length).toBe(2);

        let animal = res2.body.animalArr
        expect(animal).toEqual([{ animal_id: 1 }, { animal_id: 4 }])
      })

      it('gets a list of animal_ids in a populated database by their breed', async () => {
        const res = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          first_name: "Sam",
          last_name: "Gamgee",
          email: "baggins@gmail.com",
          admin: true
        });
        const token = res.body.token;

        await insertAnimals();
        await insertAnimalAvail();
        await insertAnimalBreed();
        await insertAnimalDispositions();
        await insertAnimalType()

        const expectedAnimals = await getExpectedTestAnimals();

        const res2 = await supertest(server).get("/animals/breed/other").set('authorization', token)

        expect((res2.body.animalArr).length).toBe(2);

        let animal = res2.body.animalArr
        expect(animal).toEqual([{ animal_id: 2 }, { animal_id: 3 }])
      })

      it('gets a list of animal_ids in a populated database by their availability', async () => {
        const res = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          first_name: "Sam",
          last_name: "Gamgee",
          email: "baggins@gmail.com",
          admin: true
        });
        const token = res.body.token;

        await insertAnimals();
        await insertAnimalAvail();
        await insertAnimalBreed();
        await insertAnimalDispositions();
        await insertAnimalType()

        const expectedAnimals = await getExpectedTestAnimals();

        const res2 = await supertest(server).get("/animals/availability/not_available").set('authorization', token)

        expect((res2.body.animalArr).length).toBe(1);

        let animal = res2.body.animalArr
        expect(animal).toEqual([{ animal_id: 3 }])
      })

      it('returns empty array when given filter_name it does not recognize', async () => {
        const res = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          first_name: "Sam",
          last_name: "Gamgee",
          email: "baggins@gmail.com",
          admin: true
        });
        const token = res.body.token;

        await insertAnimals();
        await insertAnimalAvail();
        await insertAnimalBreed();
        await insertAnimalDispositions();
        await insertAnimalType()

        const res2 = await supertest(server).get("/animals/something/else").set('authorization', token)

        expect((res2.body.animalArr).length).toBe(0);
        expect(res2.body.animalArr).toEqual([]);
      })
    })

    describe('GET /:key', () => {
      it('gets a list of the particular key in the database', async () => {
        let res = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          first_name: "Sam",
          last_name: "Gamgee",
          email: "baggins@gmail.com",
          admin: true
        });
        const token = res.body.token;

        await insertAnimals();
        await insertAnimalAvail();
        await insertAnimalBreed();
        await insertAnimalDispositions();
        await insertAnimalType()

        res = await supertest(server).get("/animals/types").set('authorization', token)
        expect((res.body.attributeArr).length).toBe(3)

        res = await supertest(server).get("/animals/breeds").set('authorization', token)
        expect((res.body.attributeArr).length).toBe(48)

        res = await supertest(server).get("/animals/availability").set('authorization', token)
        expect((res.body.attributeArr).length).toBe(4)

        res = await supertest(server).get("/animals/dispositions").set('authorization', token)
        expect((res.body.attributeArr).length).toBe(3)
      })

      it('sends 200 OK', async () => {
        let res = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          first_name: "Sam",
          last_name: "Gamgee",
          email: "baggins@gmail.com",
          admin: true
        });
        const token = res.body.token;

        await insertAnimals();
        await insertAnimalAvail();
        await insertAnimalBreed();
        await insertAnimalDispositions();
        await insertAnimalType()

        res = await supertest(server).get("/animals/types").set('authorization', token)
        expect(res.status).toBe(200)

        res = await supertest(server).get("/animals/breeds").set('authorization', token)
        expect(res.status).toBe(200)

        res = await supertest(server).get("/animals/availability").set('authorization', token)
        expect(res.status).toBe(200)

        res = await supertest(server).get("/animals/dispositions").set('authorization', token)
        expect(res.status).toBe(200)
      })

      it('returns empty array when non-valid key is used', async () => {
        let res = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          first_name: "Sam",
          last_name: "Gamgee",
          email: "baggins@gmail.com",
          admin: true
        });
        const token = res.body.token;

        await insertAnimals();
        await insertAnimalAvail();
        await insertAnimalBreed();
        await insertAnimalDispositions();
        await insertAnimalType()

        res = await supertest(server).get("/animals/none").set('authorization', token)
        expect((res.body.attributeArr).length).toBe(0)
      })
    })

    describe('PUT /:animal_id', () => {
      it('edits the information of an animals based on the animal_id passed in the url', async () => {
        const res = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          first_name: "Sam",
          last_name: "Gamgee",
          email: "baggins@gmail.com",
          admin: true
        });
        const token = res.body.token;

        await insertAnimals();
        await insertAnimalAvail();
        await insertAnimalBreed();
        await insertAnimalDispositions();
        await insertAnimalType()

        const expectedAnimals = await getExpectedTestAnimals();
        let expectedAnimal = expectedAnimals[0]

        let buff = fs.readFileSync('animals/macaw.jpg');
        const pic2 = buff.toString('base64');

        const newDes = 'A wonderful dog to have in the family.'
        expectedAnimal.description = newDes;

        const newNews = 'Something new'
        expectedAnimal.news_item = newNews;

        const res2 = await supertest(server).put("/animals/1").set('authorization', token).send({
          date: '07-21-2021',
          description: newDes,
          availability: 'Pending',
          pic: pic2,
          news_item: newNews,
          disposition: { "Animal must be leashed at all times": 2 },
          type: 'cat',
          breeds: { 'beagle': 3 }
        })

        const dbAnmials = await db('animals');
        expect(dbAnmials.length).toBe(4)

        let dbAnmial = await db('animals').where({ animal_id: 1 });
        const animal = dbAnmial[0]
        expect(dbAnmial.length).toBe(1)
        expect(animal.description).toEqual(expectedAnimal.description)
        expect(animal.news_item).toEqual(expectedAnimal.news_item)
        expect(animal.date_created).toEqual(new Date('07-21-2021'))
        expect(atob(animal.pic)).not.toEqual(atob(expectedAnimal.pic))

        dbAnmial = await db('animals').where({ animal_id: 3 })
        const animal2 = dbAnmial[0]
        expect(atob(animal.pic)).toEqual(atob(animal2.pic))

        const dbAvail = await db('animal_availability').where('animal_id', 1);
        expect(dbAvail).toEqual([{ animal_availability_id: 5, animal_id: 1, availability_id: 3 }])

        const dbDis = await db('animal_dispositions').where('animal_id', 1);
        expect(dbDis[1]).toEqual({ animal_dis_id: 8, animal_id: 1, disposition_id: 3 })

        const dbType = await db('animal_type').where('animal_id', 1)
        expect(dbType[0]).toEqual({ animal_type_id: 5, animal_id: 1, type_id: 2 })

        const dbBreeds = await db('animal_breeds').where('animal_id', 1)
        expect(dbBreeds[0]).toEqual({ animal_breeds_id: 7, animal_id: 1, breed_id: 2 })
      })

      it('sends 200 OK when successfully edits an animal', async () => {
        const res = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          first_name: "Sam",
          last_name: "Gamgee",
          email: "baggins@gmail.com",
          admin: true
        });
        const token = res.body.token;

        await insertAnimals();
        await insertAnimalAvail();
        await insertAnimalBreed();
        await insertAnimalDispositions();
        await insertAnimalType()

        const newDes = 'A wonderful dog to have in the family.'

        const res2 = await supertest(server).put("/animals/1").set('authorization', token).send({
          description: newDes
        })

        expect(res2.status).toBe(200);
      })

      it('sends a success message after succesful edit of one attribute', async () => {
        const res = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          first_name: "Sam",
          last_name: "Gamgee",
          email: "baggins@gmail.com",
          admin: true
        });
        const token = res.body.token;

        await insertAnimals();
        await insertAnimalAvail();
        await insertAnimalBreed();
        await insertAnimalDispositions();
        await insertAnimalType()

        const newDes = 'A wonderful dog to have in the family.'

        const res2 = await supertest(server).put("/animals/1").set('authorization', token).send({
          description: newDes
        })

        expect(res2.body.message).toBe("Edited 1 key(s) successfully")
      })

      it('sends a success message after succesful edit of multiple attribute', async () => {
        const res = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          first_name: "Sam",
          last_name: "Gamgee",
          email: "baggins@gmail.com",
          admin: true
        });
        const token = res.body.token;

        await insertAnimals();
        await insertAnimalAvail();
        await insertAnimalBreed();
        await insertAnimalDispositions();
        await insertAnimalType()

        let buff = fs.readFileSync('animals/macaw.jpg');
        const pic2 = buff.toString('base64');

        const newDes = 'A wonderful dog to have in the family.'

        const newNews = 'Something new'

        const res2 = await supertest(server).put("/animals/1").set('authorization', token).send({
          date: '07-21-2021',
          description: newDes,
          availability: 'Pending',
          pic: pic2,
          news_item: newNews,
          disposition: { "Animal must be leashed at all times": 2 },
          type: 'cat',
          breeds: { 'beagle': 3 }
        })

        expect(res2.body.message).toBe("Edited 7 key(s) successfully")
      })

      it('sends error message when no body is sent', async () => {
        const res = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          first_name: "Sam",
          last_name: "Gamgee",
          email: "baggins@gmail.com",
          admin: true
        });
        const token = res.body.token;

        await insertAnimals();
        await insertAnimalAvail();
        await insertAnimalBreed();
        await insertAnimalDispositions();
        await insertAnimalType()

        const res2 = await supertest(server).put("/animals/1").set('authorization', token).send({})

        expect(res2.body.error).toBe("The request object is missing one or more required attributes")
      })

      it('sends error message when body is sent with wrong data type', async () => {
        const res = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          first_name: "Sam",
          last_name: "Gamgee",
          email: "baggins@gmail.com",
          admin: true
        });
        const token = res.body.token;

        await insertAnimals();
        await insertAnimalAvail();
        await insertAnimalBreed();
        await insertAnimalDispositions();
        await insertAnimalType()

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

        const res6 = await supertest(server).put("/animals/1").set('authorization', token).send({
          disposition: 123
        })

        expect(res6.body.error).toBe("The request object attributes have one or more of the wrong type")

        const res7 = await supertest(server).put("/animals/1").set('authorization', token).send({
          type: 123
        })

        expect(res7.body.error).toBe("The request object attributes have one or more of the wrong type")

        const res8 = await supertest(server).put("/animals/1").set('authorization', token).send({
          breeds: 123
        })

        expect(res8.body.error).toBe("The request object attributes have one or more of the wrong type")

        const res9 = await supertest(server).put("/animals/1").set('authorization', token).send({
          availability: 123
        })

        expect(res9.body.error).toBe("The request object attributes have one or more of the wrong type")
      })

      it('sends status code 400 when body is sent with wrong data type', async () => {
        const res = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          first_name: "Sam",
          last_name: "Gamgee",
          email: "baggins@gmail.com",
          admin: true
        });
        const token = res.body.token;

        await insertAnimals();
        await insertAnimalAvail();
        await insertAnimalBreed();
        await insertAnimalDispositions();
        await insertAnimalType()

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

        const res6 = await supertest(server).put("/animals/1").set('authorization', token).send({
          disposition: 123
        })

        expect(res6.status).toBe(400)

        const res7 = await supertest(server).put("/animals/1").set('authorization', token).send({
          type: 123
        })

        expect(res7.status).toBe(400)

        const res8 = await supertest(server).put("/animals/1").set('authorization', token).send({
          breeds: 123
        })

        expect(res8.status).toBe(400)

        const res9 = await supertest(server).put("/animals/1").set('authorization', token).send({
          availability: 123
        })

        expect(res9.status).toBe(400)
      })

    })

    describe('POST /', () => {
      it('adds a new animal to the database', async () => {
        const res = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          first_name: "Sam",
          last_name: "Gamgee",
          email: "baggins@gmail.com",
          admin: true
        });
        const token = res.body.token;

        let animalList = await getTestAnimals()
        const testAnimal = animalList[0];

        const res2 = await supertest(server).post("/animals").set('authorization', token).send(testAnimal)

        animalList = await getExpectedTestAnimals();
        const expectedAnimal = animalList[0]

        const dbAnmials = await db('animals');
        expect(dbAnmials.length).toBe(1)
        let animal = dbAnmials[0];
        expect(animal.description).toEqual(expectedAnimal.description)
        expect(animal.news_item).toEqual(expectedAnimal.news_item)

        const dbAnimalDis = await db('animal_dispositions');
        expect(dbAnimalDis.length).toBe(2)
        expect(dbAnimalDis).toEqual([{ animal_dis_id: 1, animal_id: 1, disposition_id: 2 }, { animal_dis_id: 2, animal_id: 1, disposition_id: 1 }])

        const dbAnimalAvail = await db('animal_availability');
        expect(dbAnimalAvail.length).toBe(1);
        expect(dbAnimalAvail).toEqual([{ animal_availability_id: 1, animal_id: 1, availability_id: 2 }])

        const dbAnimalBreed = await db('animal_breeds');
        expect(dbAnimalBreed.length).toBe(1);
        expect(dbAnimalBreed).toEqual([{ animal_breeds_id: 1, animal_id: 1, breed_id: 3 }])

        const dbAnimalType = await db('animal_type');
        expect(dbAnimalType.length).toBe(1);
        expect(dbAnimalType).toEqual([{ animal_type_id: 1, animal_id: 1, type_id: 1 }])
      })

      it('sends 201 created when new animal added to database', async () => {
        const res = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          first_name: "Sam",
          last_name: "Gamgee",
          email: "baggins@gmail.com",
          admin: true
        });
        const token = res.body.token;

        let animalList = await getTestAnimals()
        const testAnimal = animalList[0];

        const res2 = await supertest(server).post("/animals").set('authorization', token).send(testAnimal)

        expect(res2.status).toBe(201)
      })

      it('sends new animal_id in body of json response when adding new animal to database', async () => {
        const res = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          first_name: "Sam",
          last_name: "Gamgee",
          email: "baggins@gmail.com",
          admin: true,
        });
        const token = res.body.token;

        let animalList = await getTestAnimals()
        const testAnimal = animalList[0];

        const res2 = await supertest(server).post("/animals").set('authorization', token).send(testAnimal)

        expect(res2.body.animal).toBe(1)
      })

      it('error message when no body is sent', async () => {
        const res = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          first_name: "Sam",
          last_name: "Gamgee",
          email: "baggins@gmail.com",
          admin: true
        });
        const token = res.body.token;

        const res2 = await supertest(server).post("/animals").set('authorization', token).send()

        expect(res2.body.error).toEqual('The request object is missing one or more required attributes')
      })

      it('sends 400 status when no body sent', async () => {
        const res = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          first_name: "Sam",
          last_name: "Gamgee",
          email: "baggins@gmail.com",
          admin: true
        });
        const token = res.body.token;

        const res2 = await supertest(server).post("/animals").set('authorization', token).send()

        expect(res2.status).toBe(400)
      })

      it('error message when attribute has wrong data types', async () => {
        const res = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          first_name: "Sam",
          last_name: "Gamgee",
          email: "baggins@gmail.com",
          admin: true
        });
        const token = res.body.token;

        const testAnimals = await getTestAnimals();
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

        testAnimal = testAnimals[0]
        delete testAnimal.animal_id

        testAnimal.disposition = 1234

        const res6 = await supertest(server).post("/animals").set('authorization', token).send(testAnimal)

        expect(res6.body.error).toEqual('The request object attributes have one or more of the wrong type')
      })

      it('adds a date when date_created is missing on the animal object', async () => {
        const res = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          first_name: "Sam",
          last_name: "Gamgee",
          email: "baggins@gmail.com",
          admin: true,
        });
        const token = res.body.token;

        const testAnimals = await getTestAnimals();
        let testAnimal = testAnimals[0]
        delete testAnimal.date_created

        const res2 = await supertest(server).post("/animals").set('authorization', token).send(testAnimal)

        const dbAnmials = await db('animals');
        expect(dbAnmials.length).toBe(1)

        const dbAnimalDis = await db('animal_dispositions')
        expect(dbAnimalDis.length).toBe(2)
      })
    })

    describe('DELETE /:animal_id', () => {
      it('deletes animal from database', async () => {
        const res = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          first_name: "Sam",
          last_name: "Gamgee",
          email: "baggins@gmail.com",
          admin: true
        });
        const token = res.body.token;

        await insertAnimals();
        await insertAnimalAvail();
        await insertAnimalBreed();
        await insertAnimalDispositions();
        await insertAnimalType()

        const res2 = await supertest(server).del("/animals/1").set('authorization', token)

        const dbAnmials = await db('animals');
        expect(dbAnmials.length).toBe(3)

        const dbDis = await db('animal_dispositions').where('animal_id', 1);
        expect(dbDis.length).toBe(0);
        expect(dbDis).toEqual([]);

        const dbAnimalDis = await db('animal_dispositions');
        expect(dbAnimalDis.length).toBe(5);

        let dbBreeds = await db('animal_breeds').where('animal_id', 1)
        expect(dbBreeds.length).toBe(0)
        expect(dbBreeds).toEqual([])

        dbBreeds = await db('animal_breeds')
        expect(dbBreeds.length).toBe(5)

        let dbTypes = await db('animal_type').where('animal_id', 1)
        expect(dbTypes.length).toBe(0);
        expect(dbTypes).toEqual([])

        dbTypes = await db('animal_type')
        expect(dbTypes.length).toBe(3)

        let dbAvail = await db('animal_availability').where('animal_id', 1);
        expect(dbAvail.length).toBe(0);
        expect(dbAvail).toEqual([])

        dbAvail = await db('animal_availability')
        expect(dbAvail.length).toBe(3);
      })

      it('sends 200 when successfully deletes animal from database', async () => {
        const res = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          first_name: "Sam",
          last_name: "Gamgee",
          email: "baggins@gmail.com",
          admin: true
        });
        const token = res.body.token;

        await insertAnimals();
        await insertAnimalAvail();
        await insertAnimalBreed();
        await insertAnimalDispositions();
        await insertAnimalType()

        const res2 = await supertest(server).del("/animals/1").set('authorization', token)

        expect(res2.status).toBe(200);
      })

      it('sends success message after successfully deletes animal from database', async () => {
        const res = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          first_name: "Sam",
          last_name: "Gamgee",
          email: "baggins@gmail.com",
          admin: true
        });
        const token = res.body.token;

        await insertAnimals();
        await insertAnimalAvail();
        await insertAnimalBreed();
        await insertAnimalDispositions();
        await insertAnimalType()

        const res2 = await supertest(server).del("/animals/1").set('authorization', token)

        expect(res2.body.message).toEqual("1 deleted successfully");
      })

      it('sends 404 when trying to delete animal with an animal_id not in the database', async () => {
        const res = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          first_name: "Sam",
          last_name: "Gamgee",
          email: "baggins@gmail.com",
          admin: true
        });
        const token = res.body.token;

        const res2 = await supertest(server).del("/animals/1").set('authorization', token)

        expect(res2.status).toBe(404);
      })

      it('sends error message when trying to delete animal with an animal_id not in the database', async () => {
        const res = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          first_name: "Sam",
          last_name: "Gamgee",
          email: "baggins@gmail.com",
          admin: true
        });
        const token = res.body.token;

        const res2 = await supertest(server).del("/animals/1").set('authorization', token)

        expect(res2.body.message).toEqual('No animal with that id was found');
      })
    })

    describe('DELETE /:animal_id/key/key_id', () => {
      it('deletes one particular item from an animals array attributes', async () => {
        const res = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          first_name: "Sam",
          last_name: "Gamgee",
          email: "baggins@gmail.com",
          admin: true
        });
        const token = res.body.token;

        await insertAnimals();
        await insertAnimalAvail();
        await insertAnimalBreed();
        await insertAnimalDispositions();
        await insertAnimalType()

        let res2 = await supertest(server).del("/animals/1/disposition/2").set('authorization', token)

        let dbDis = await db('animal_dispositions').where('animal_id', 1);
        expect(dbDis.length).toBe(1);
        expect(dbDis).toEqual([{ animal_dis_id: 1, animal_id: 1, disposition_id: 1 }]);

        res2 = await supertest(server).del("/animals/2/breeds/48").set('authorization', token)
        dbBreeds = await db('animal_breeds').where('animal_id', 2);
        expect(dbBreeds.length).toBe(1);
        expect(dbBreeds).toEqual([{ animal_breeds_id: 3, animal_id: 2, breed_id: 37 }]);
      })

      it('sends 200 when successfully deletes animal from database', async () => {
        const res = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          first_name: "Sam",
          last_name: "Gamgee",
          email: "baggins@gmail.com",
          admin: true
        });
        const token = res.body.token;

        await insertAnimals();
        await insertAnimalAvail();
        await insertAnimalBreed();
        await insertAnimalDispositions();
        await insertAnimalType()

        let res2 = await supertest(server).del("/animals/1/disposition/2").set('authorization', token)

        expect(res2.status).toBe(200)

        res2 = await supertest(server).del("/animals/2/breeds/48").set('authorization', token)
        expect(res2.status).toBe(200)
      })

      it('sends success message after successfully deletes animal from database', async () => {
        const res = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          first_name: "Sam",
          last_name: "Gamgee",
          email: "baggins@gmail.com",
          admin: true
        });
        const token = res.body.token;

        await insertAnimals();
        await insertAnimalAvail();
        await insertAnimalBreed();
        await insertAnimalDispositions();
        await insertAnimalType()

        let res2 = await supertest(server).del("/animals/1/disposition/2").set('authorization', token)

        expect(res2.body.message).toEqual('1 key(s) deleted successfully')

        res2 = await supertest(server).del("/animals/2/breeds/48").set('authorization', token)
        expect(res2.body.message).toEqual('1 key(s) deleted successfully')
      })

      it('sends 404 when trying to delete animal with an animal_id not in the database', async () => {
        const res = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          first_name: "Sam",
          last_name: "Gamgee",
          email: "baggins@gmail.com",
          admin: true
        });
        const token = res.body.token;

        let res2 = await supertest(server).del("/animals/1/disposition/2").set('authorization', token)

        expect(res2.status).toBe(404)

      })

      it('sends error message when trying to delete animal with an animal_id not in the database', async () => {
        const res = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          first_name: "Sam",
          last_name: "Gamgee",
          email: "baggins@gmail.com",
          admin: true
        });
        const token = res.body.token;

        let res2 = await supertest(server).del("/animals/1/disposition/2").set('authorization', token)

        expect(res2.body.message).toEqual('No animal with that id was found')

      })
    })
  })

  describe('UsersRouter /users', () => {
    describe('GET /', () => {
      it('gets user based on jwt token passed in header', async () => {
        let res = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          first_name: "Sam",
          last_name: "Gamgee",
          email: "baggins@gmail.com",
          admin: true
        });
        const token = res.body.token;

        res = await supertest(server).get('/users').set('authorization', token);
        expect((res.body.user).length).toBe(1);
        const user = res.body.user[0]
        expect(user.user_id).toBe(1);
        expect(user.username).toEqual('sam')
        expect(user.first_name).toEqual('Sam')
        expect(user.last_name).toEqual('Gamgee')
        expect(user.email).toEqual('baggins@gmail.com')
        expect(user.admin).toBe(true)
        expect(user.password).not.toEqual('pass')
      })

      it('sends 200 status when getting user', async () => {
        let res = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          first_name: "Sam",
          last_name: "Gamgee",
          email: "baggins@gmail.com",
          admin: true
        });
        const token = res.body.token;

        res = await supertest(server).get('/users').set('authorization', token);
        expect(res.status).toBe(200)
      })

      it('sends error message with no jwt token provided', async () => {
        let res = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          first_name: "Sam",
          last_name: "Gamgee",
          email: "baggins@gmail.com",
          admin: true
        });
        const token = res.body.token;

        res = await supertest(server).get('/users').set('authorization', '');
        expect(res.body.message).toEqual('Invalid token')
      })

      it('sends 401 status with no token sent', async () => {
        let res = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          first_name: "Sam",
          last_name: "Gamgee",
          email: "baggins@gmail.com",
          admin: true
        });
        const token = res.body.token;

        res = await supertest(server).get('/users').set('authorization', '');
        expect(res.status).toBe(401)
      })
    })

    describe('PUT /', () => {
      it('edits a user', async () => {
        let res = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          first_name: "Sam",
          last_name: "Gamgee",
          email: "baggins@gmail.com",
          admin: true
        });
        const token = res.body.token;

        const changeUsername = 'samG'
        const changePassword = 'frodo'
        const changeFirstName = 'Samual'
        const changeLastName = 'GamGee'
        const changeEmail = 'gamgee@gmail.com'

        res = await supertest(server).put("/users").send({
          first_name: changeFirstName,
        }).set('Authorization', token);
        let users = await db('users').where({ user_id: 1 })
        expect(users[0].first_name).toEqual(changeFirstName)

        res = await supertest(server).put("/users").send({
          last_name: changeLastName,
        }).set('Authorization', token);
        users = await db('users').where({ user_id: 1 })
        expect(users[0].last_name).toEqual(changeLastName)

        res = await supertest(server).put("/users").send({
          email: changeEmail,
        }).set('Authorization', token);
        users = await db('users').where({ user_id: 1 })
        expect(users[0].email).toEqual(changeEmail)

        res = await supertest(server).put("/users").send({
          username: changeUsername,
        }).set('Authorization', token);
        users = await db('users').where({ user_id: 1 })
        expect(users[0].username).toEqual(changeUsername)

        res = await supertest(server).put("/users").send({
          password: changePassword,
        }).set('Authorization', token);
        users = await db('users').where({ user_id: 1 })
        expect(users[0].password).not.toEqual(changePassword)
      })

      it('sends 200 status code', async () => {
        let res = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          first_name: "Sam",
          last_name: "Gamgee",
          email: "baggins@gmail.com",
          admin: true
        });
        let token = res.body.token;

        const changeUsername = 'samG'
        const changePassword = 'frodo'
        const changeFirstName = 'Samual'
        const changeLastName = 'GamGee'
        const changeEmail = 'gamgee@gmail.com'

        res = await supertest(server).put("/users").send({
          first_name: changeFirstName,
        }).set('Authorization', token);
        expect(res.status).toBe(200)

        res = await supertest(server).put("/users").send({
          last_name: changeLastName,
        }).set('Authorization', token);
        expect(res.status).toBe(200)

        res = await supertest(server).put("/users").send({
          email: changeEmail,
        }).set('Authorization', token);
        expect(res.status).toBe(200)

        res = await supertest(server).put("/users").send({
          username: changeUsername,
        }).set('Authorization', token);
        token = res.body.new_token
        expect(res.status).toBe(200)

        res = await supertest(server).put("/users").send({
          password: changePassword,
        }).set('Authorization', token);
        expect(res.status).toBe(200)
      })

      it('sends 200 success message', async () => {
        let res = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          first_name: "Sam",
          last_name: "Gamgee",
          email: "baggins@gmail.com",
          admin: true
        });
        let token = res.body.token;

        const changeUsername = 'samG'
        const changePassword = 'frodo'
        const changeFirstName = 'Samual'
        const changeLastName = 'GamGee'
        const changeEmail = 'gamgee@gmail.com'

        res = await supertest(server).put("/users").send({
          first_name: changeFirstName,
        }).set('Authorization', token);
        expect(res.body.message).toEqual('Edited 1 user(s) successfully')

        res = await supertest(server).put("/users").send({
          last_name: changeLastName,
        }).set('Authorization', token);
        expect(res.body.message).toEqual('Edited 1 user(s) successfully')

        res = await supertest(server).put("/users").send({
          email: changeEmail,
        }).set('Authorization', token);
        expect(res.body.message).toEqual('Edited 1 user(s) successfully')

        res = await supertest(server).put("/users").send({
          username: changeUsername,
        }).set('Authorization', token);
        token = res.body.new_token
        expect(res.body.message).toEqual('Edited 1 user(s) successfully')

        res = await supertest(server).put("/users").send({
          password: changePassword,
        }).set('Authorization', token);
        expect(res.body.message).toEqual('Edited 1 user(s) successfully')
      })

      it('sends 400 status code when sending with wrong datatype', async () => {
        let res = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          first_name: "Sam",
          last_name: "Gamgee",
          email: "baggins@gmail.com",
          admin: true
        });
        let token = res.body.token;

        const changeUsername = 123
        const changePassword = 123
        const changeFirstName = 123
        const changeLastName = 123
        const changeEmail = 123

        res = await supertest(server).put("/users").send({
          first_name: changeFirstName,
        }).set('Authorization', token);
        expect(res.status).toBe(400)

        res = await supertest(server).put("/users").send({
          last_name: changeLastName,
        }).set('Authorization', token);
        expect(res.status).toBe(400)

        res = await supertest(server).put("/users").send({
          email: changeEmail,
        }).set('Authorization', token);
        expect(res.status).toBe(400)

        res = await supertest(server).put("/users").send({
          username: changeUsername,
        }).set('Authorization', token);
        expect(res.status).toBe(400)

        res = await supertest(server).put("/users").send({
          password: changePassword,
        }).set('Authorization', token);
        expect(res.status).toBe(400)
      })

      it('sends 400 error message when sending with wrong datatype', async () => {
        let res = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          first_name: "Sam",
          last_name: "Gamgee",
          email: "baggins@gmail.com",
          admin: true
        });
        let token = res.body.token;

        const changeUsername = 123
        const changePassword = 123
        const changeFirstName = 123
        const changeLastName = 123
        const changeEmail = 123

        res = await supertest(server).put("/users").send({
          first_name: changeFirstName,
        }).set('Authorization', token);
        expect(res.body.error).toEqual('The request object attributes have one or more of the wrong type')

        res = await supertest(server).put("/users").send({
          last_name: changeLastName,
        }).set('Authorization', token);
        expect(res.body.error).toEqual('The request object attributes have one or more of the wrong type')

        res = await supertest(server).put("/users").send({
          email: changeEmail,
        }).set('Authorization', token);
        expect(res.body.error).toEqual('The request object attributes have one or more of the wrong type')

        res = await supertest(server).put("/users").send({
          username: changeUsername,
        }).set('Authorization', token);
        expect(res.body.error).toEqual('The request object attributes have one or more of the wrong type')

        res = await supertest(server).put("/users").send({
          password: changePassword,
        }).set('Authorization', token);
        expect(res.body.error).toEqual('The request object attributes have one or more of the wrong type')
      })

      it('sends 400 status code when sending with no body', async () => {
        let res = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          first_name: "Sam",
          last_name: "Gamgee",
          email: "baggins@gmail.com",
          admin: true
        });
        let token = res.body.token;

        res = await supertest(server).put("/users").send({}).set('Authorization', token);
        expect(res.status).toBe(400)
      })

      it('sends 400 error message when sending with no body', async () => {
        let res = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          first_name: "Sam",
          last_name: "Gamgee",
          email: "baggins@gmail.com",
          admin: true
        });
        let token = res.body.token;

        res = await supertest(server).put("/users").send({}).set('Authorization', token);
        expect(res.body.error).toEqual('The request object is missing one or more required attributes')
      })

      it('can login a user after changing the username', async () => {
        let res = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          first_name: "Sam",
          last_name: "Gamgee",
          email: "baggins@gmail.com",
          admin: true
        });
        let token = res.body.token;

        const changeUsername = 'samG'

        res = await supertest(server).put("/users").send({
          username: changeUsername,
        }).set('Authorization', token);

        res = await supertest(server).post('/auth/login').send({
          username: changeUsername,
          password: 'pass'
        })
        expect(res.status).toBe(200)
        expect(res.body.token).not.toBeNull();
        expect(res.body.admin).toBe(true)
      })

      it('can login a user after changing the password', async () => {
        let res = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          first_name: "Sam",
          last_name: "Gamgee",
          email: "baggins@gmail.com",
          admin: true
        });
        let token = res.body.token;

        const changePassword = 'frodo'

        res = await supertest(server).put("/users").send({
          password: changePassword,
        }).set('Authorization', token);
        expect(res.body.message).toEqual('Edited 1 user(s) successfully')

        res = await supertest(server).post('/auth/login').send({
          username: 'sam',
          password: changePassword
        })
        expect(res.status).toBe(200)
        expect(res.body.token).not.toBeNull();
        expect(res.body.admin).toBe(true)
      })
    })

    describe('DELETE /', () => {
      it('deletes a user', async () => {
        let res = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          first_name: "Sam",
          last_name: "Gamgee",
          email: "baggins@gmail.com",
          admin: true
        });
        const token = res.body.token;


        res = await supertest(server).delete("/users").set('Authorization', token);
        let users = await db('users').where({ user_id: 1 })
        expect(users.length).toBe(0)
      })

      it('sends 200 OK when deleting a user', async () => {
        let res = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          first_name: "Sam",
          last_name: "Gamgee",
          email: "baggins@gmail.com",
          admin: true
        });
        const token = res.body.token;


        res = await supertest(server).delete("/users").set('Authorization', token);
        expect(res.status).toBe(200);
      })

      it('sends successful status message', async () => {
        let res = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          first_name: "Sam",
          last_name: "Gamgee",
          email: "baggins@gmail.com",
          admin: true
        });
        const token = res.body.token;

        res = await supertest(server).delete("/users").set('Authorization', token);
        expect(res.body.message).toEqual('1 user deleted successfully');
      })

      it('sends 404 when deleting a user not in database', async () => {
        let res = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          first_name: "Sam",
          last_name: "Gamgee",
          email: "baggins@gmail.com",
          admin: true
        });
        const token = res.body.token;


        res = await supertest(server).delete("/users").set('Authorization', token);
        expect(res.status).toBe(200);

        res = await supertest(server).delete("/users").set('Authorization', token);
        expect(res.status).toBe(404);
      })

      it('sends 404 error message when deleting a user not in database', async () => {
        let res = await supertest(server).post("/auth/register").send({
          username: "sam",
          password: "pass",
          first_name: "Sam",
          last_name: "Gamgee",
          email: "baggins@gmail.com",
          admin: true
        });
        const token = res.body.token;


        res = await supertest(server).delete("/users").set('Authorization', token);

        res = await supertest(server).delete("/users").set('Authorization', token);
        expect(res.body.message).toEqual('No user with that username exists ');
      })
    })
  })
});
