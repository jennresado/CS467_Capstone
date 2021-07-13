const db = require("../db/dbconfig");
const Animals = require("./animalsModel");
const constants = require("./testConstants");
const fs = require('fs');
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
      date_created: new Date('01-01-2020'),
      description: "A very good cat. Wonderful with other animals. Watch when around children",
      news_item: constants.news1,
      animal_id: 2
    }, {
      pic: pic1,
      date_created: new Date('01-01-2019'),
      description: "A very good bird. Good around other birds only",
      news_item: constants.news1,
      animal_id: 3
    }, {
      pic: pic1,
      date_created: new Date('06-20-2018'),
      description:
        "A very good dog. Wonderful with children and other animals. Looking for his forever home.",
      news_item: constants.news1,
      animal_id: 4
    }
  ]
}

//async forEach method
async function asyncForEach(array, cb) {
  for (let i = 0; i < array.length; i++) {
    await cb(array[i], i, array);
  }
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

      //converts the binary array to a base64string
      animals[0].pic = atob(animals[0].pic);
      expect(animals).toHaveLength(1);
      expect(animals).toEqual(shouldGet);
    })

    it('adds an animal to a non-empty db', async ()=>{
      let list = await getTestAnimals();
      let animalList = [list[0], list[1], list[2]]
      let dbTestAnimals = getExpectedTestAnimals();

      await asyncForEach(animalList, async (animal) => {
        await db('animals').insert(animal);
      })

      await Animals.addAnimal(list[3]);
      const animals = await db('animals');

      expect(animals).toHaveLength(4);
    })
  })


  describe('editAnimal(animal_id, animalEdits)', ()=>{
    it('edits an animal in a db with 1 entry', async ()=>{
      let animals = await getTestAnimals();
      await db('animals').insert(animals[0])
      const dbTestAnimals = await getExpectedTestAnimals();

      let expectedAnimal = dbTestAnimals[0];
      expectedAnimal.description = "A very lovable dog";
      
      const count = await Animals.editAnimal(1, {
        description: "A very lovable dog"
      })
      const animal = await db('animals');
      animal[0].pic = atob(animal[0].pic);

      expect(count).toBe(1);
      expect(animal).toEqual([expectedAnimal])
    })

    it('edits an animal in a db with more than 1 entry', async ()=>{
      const testAnimals = await getTestAnimals();
      const description = 'Great bird to make you feel like snow white'

      await asyncForEach(testAnimals, async (animal)=>{
        await db('animals').insert(animal)
      })

      let expectedAnimals = await getExpectedTestAnimals();
      let expectedAnimal = expectedAnimals[2]
      expectedAnimal.description = description

      const count = await Animals.editAnimal(3, {
        description
      })
      expect(count).toBe(1)

      let animals = await db('animals').where({animal_id: 3});
      let dbAnimal = animals[0];
      dbAnimal.pic = atob(dbAnimal.pic)
      
      expect(expectedAnimal).toEqual(dbAnimal)
    })
  })

  describe('getAllAnimals()', ()=>{
    it('gets a list of animals in a populated database', async ()=>{
      let animals = await getTestAnimals();
      let expectedAnimals = await getExpectedTestAnimals();

      await asyncForEach(animals, async (animal) =>{
        await db('animals').insert(animal)
      })

      let dbAnimals = await Animals.getAllAnimals();
      expect(dbAnimals.length).toBe(4);

      await asyncForEach(dbAnimals, async (animal) =>{
        animal.pic = atob(animal.pic);
      })

      expect(dbAnimals).toEqual(expectedAnimals);

    })

    it('returns an empty array when trying to get an animal_id that is not in the database ', async ()=>{
      let animal = await Animals.getAllAnimals()
      expect(animal).toEqual([])
    })
  })

  describe('getAnimalBy(filterName, filterValue)', ()=>{
    it('gets a list of animals in a populated database by their animal_id', async ()=>{
      let animals = await getTestAnimals();
      let expectedAnimals = await getExpectedTestAnimals();

      await asyncForEach(animals, async (animal) =>{
        await db('animals').insert(animal)
      })

      let dbAnimals = await db('animals');
      expect(dbAnimals.length).toBe(4);

      await asyncForEach(dbAnimals, async (animal) =>{
        animal.pic = atob(animal.pic);
      })

      expect(dbAnimals).toEqual(expectedAnimals);

      let animal = await Animals.getAnimalBy('animal_id', 1);
      let animal1 = animal[0]
      animal1.pic = atob(animal1.pic);
      expect(animal1).toEqual(expectedAnimals[0])
    })

    it('returns an empty array when trying to get an animal_id that is not in the database ', async ()=>{
      let animals = await getTestAnimals();
      let expectedAnimals = await getExpectedTestAnimals();

      await asyncForEach(animals, async (animal) =>{
        await db('animals').insert(animal)
      })

      let dbAnimals = await db('animals');
      expect(dbAnimals.length).toBe(4);

      await asyncForEach(dbAnimals, async (animal) =>{
        animal.pic = atob(animal.pic);
      })

      expect(dbAnimals).toEqual(expectedAnimals);

      let animal5 = await Animals.getAnimalBy('animal_id', 5);
      expect(animal5).toEqual([])
    })

    it('gets a list of animals in a populated database by their date created', async ()=>{
      let animals = await getTestAnimals();
      let expectedAnimals = await getExpectedTestAnimals();

      await asyncForEach(animals, async (animal) =>{
        await db('animals').insert(animal)
      })

      let dbAnimals = await db('animals');
      expect(dbAnimals.length).toBe(4);

      await asyncForEach(dbAnimals, async (animal) =>{
        animal.pic = atob(animal.pic);
        return animal;
      })

      expect(dbAnimals).toEqual(expectedAnimals);

      let animal = await Animals.getAnimalBy('date', '06-20-2021')
      let animal1 = animal[0]
      animal1.pic = atob(animal1.pic)

      expect(animal1).toEqual(expectedAnimals[0])
    })

    it('returns an empty array when trying to get an animal by a date created that does not exist', async ()=>{
      let animals = await getTestAnimals();
      let expectedAnimals = await getExpectedTestAnimals();

      await asyncForEach(animals, async (animal) =>{
        await db('animals').insert(animal)
      })

      let dbAnimals = await db('animals');
      expect(dbAnimals.length).toBe(4);

      await asyncForEach(dbAnimals, async (animal) =>{
        animal.pic = atob(animal.pic);
      })

      expect(dbAnimals).toEqual(expectedAnimals);

      let animal = await Animals.getAnimalBy('date', '06-20-1900')
      expect(animal).toEqual([]);
    })
  })

  describe('deteleAnimal(animal_id)', ()=>{
    it('deletes single animal from database holding 1 animal', async ()=>{
      let animals = await getTestAnimals();

      await db('animals').insert(animals[0])

      let dbAnimals = await db('animals');
      expect(dbAnimals.length).toBe(1);

     const count = await Animals.deleteAnimal(1)
     dbAnimals = await db('animals');

     expect(count).toBe(1);
     expect(dbAnimals).toEqual([]);
    })

    it('deletes single animal from populated database', async ()=>{
      let animals = await getTestAnimals();
      let expectedAnimals = await getExpectedTestAnimals()

      await asyncForEach(animals, async(animal) =>{
        await db('animals').insert(animal);
      })

      let dbAnimals = await db('animals');
      expect(dbAnimals.length).toBe(4);

     const count = await Animals.deleteAnimal(1)
     dbAnimals = await db('animals');

     await asyncForEach(dbAnimals, async (animal) =>{
      animal.pic = atob(animal.pic);
    })

     expect(count).toBe(1);
     expect(dbAnimals).toEqual([expectedAnimals[1], expectedAnimals[2], expectedAnimals[3]]);
    })

    it('returns 0 when trying to delete an animal that does not exist in the', async ()=>{
      let animals = await getTestAnimals();
      let expectedAnimals = await getExpectedTestAnimals()

      await asyncForEach(animals, async(animal) =>{
        await db('animals').insert(animal);
      })

      let dbAnimals = await db('animals');
      expect(dbAnimals.length).toBe(4);

     const count = await Animals.deleteAnimal(5)
     dbAnimals = await db('animals');

     await asyncForEach(dbAnimals, async (animal) =>{
      animal.pic = atob(animal.pic);
    })

     expect(count).toBe(0);
     expect(dbAnimals).toEqual(expectedAnimals);
    })
  })
})

module.exports = {
  getTestAnimals, getExpectedTestAnimals, asyncForEach
}