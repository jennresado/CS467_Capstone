const db = require("../db/dbconfig");
const Animals = require("./animalsModel");
const constants = require("./testConstants");
const fs = require('fs')
const atob = require('atob')

//sample animals to be used in tests
async function getTestAnimals() {
  let buff = fs.readFileSync('animals/collie.jpeg');
  const pic1 = buff.toString('base64');
  ;
  const animal1 = {
    pic: pic1,
    date_created: "06-20-2021",
    description:
      "A very good dog. Wonderful with children and other animals. Looking for his forever home.",
    news_item: constants.news1,
  };

  const animal2 = {
    pic: pic1,
    date_created: "01-01-2020",
    description: "A very good cat. Wonderful with other animals. Watch when around children",
    news_item: constants.news1
  };

  const animal3 = {
    pic: pic1,
    date_created: "01-01-2019",
    description: "A very good bird. Good around other birds only",
    news_item: constants.news1
  }

  const animal4 = {
    pic: pic1,
    date_created: "06-20-2018",
    description:
      "A very good dog. Wonderful with children and other animals. Looking for his forever home.",
    news_item: constants.news1,
  }

  return [animal1, animal2, animal3, animal4]
}

async function getExpectedTestAnimals() {
  let buff = fs.readFileSync('animals/collie.jpeg');
  let pic1 = buff.toString('base64');
  return [
    {
      pic: pic1,
      date_created: new Date('06-20-2021'),
      description:
        "A very good dog. Wonderful with children and other animals. Looking for his forever home.",
      news_item: constants.news1,
      animal_id: 1
    }, {
      pic: pic1,
      date_created: "2020-01-01T04:00:00.000Z",
      description: "A very good cat. Wonderful with other animals. Watch when around children",
      news_item: constants.news1,
      animal_id: 2
    }, {
      pic: pic1,
      date_created: "2019-01-01T04:00:00.000Z",
      description: "A very good bird. Good around other birds only",
      news_item: constants.news1,
      animal_id: 3
    }, {
      pic: pic1,
      date_created: "2018-06-20T04:00:00.000Z",
      description:
        "A very good dog. Wonderful with children and other animals. Looking for his forever home.",
      news_item: constants.news1,
      animal_id: 4
    }
  ]
}

describe('animalsModel', ()=>{
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

  describe('addAnimal(animalObj)', ()=>{
    it('adds an aniaml to an empty db', async ()=>{
      let animalList = await getTestAnimals();
      let dbTestAnimals = await getExpectedTestAnimals();

      await Animals.addAnimal(animalList[0])

      const animals = await db('animals');
      const shouldGet = [dbTestAnimals[0]];

      animals[0].pic = atob(animals[0].pic);
      expect(animals).toHaveLength(1);
      expect(animals).toEqual(shouldGet);
    })
  })
})