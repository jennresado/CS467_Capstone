const db = require("../db/dbconfig");
const Animals = require("./animalsModel");
const Avail = require('../animal_availabilities/availModel')
const Breeds = require('../breeds/breedsModel')
const Dispositions = require('../dispositions/dispositionsModel')
const Types = require('../types/typesModel')
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
    disposition: ['Good with other animals', 'Good with children'],
    type: 'dog',
    breeds: ['border collie'],
    availability: 'Available',
  };

  const animal2 = {
    pic: pic1,
    date_created: "01-01-2020",
    description: "A very good cat. Wonderful with other animals. Watch when around children",
    news_item: constants.news1,
    disposition: ['Good with other animals', 'Animal must be leashed at all times'],
    type: 'cat',
    breeds: ['maine coon', 'other'],
    availability: 'Pending',
  };

  const animal3 = {
    pic: pic1,
    date_created: "01-01-2019",
    description: "A very good bird. Good around other birds only",
    news_item: constants.news1,
    disposition: [],
    type: 'other',
    breeds: ['other'],
    availability: 'Not Available',
  }

  const animal4 = {
    pic: pic1,
    date_created: "06-20-2018",
    description:
      "A very good dog. Wonderful with children and other animals.",
    news_item: constants.news1,
    disposition: ['Good with other animals', 'Good with children', 'Animal must be leashed at all times'],
    type: 'dog',
    breeds: ['border collie', 'beagle'],
    availability: 'Pending',
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
      animal_id: 1,
      disposition: ['Good with other animals', 'Good with children'].sort(),
      type: 'dog',
      breeds: ['border collie'],
      availability: 'Available'
    }, {
      pic: pic1,
      date_created: new Date('01-01-2020'),
      description: "A very good cat. Wonderful with other animals. Watch when around children",
      news_item: constants.news1,
      animal_id: 2,
      disposition: ['Good with other animals', 'Animal must be leashed at all times'].sort(),
      type: 'cat',
      breeds: ['maine coon', 'other'].sort(),
      availability: 'Pending',
    }, {
      pic: pic1,
      date_created: new Date('01-01-2019'),
      description: "A very good bird. Good around other birds only",
      news_item: constants.news1,
      animal_id: 3,
      disposition: [],
      type: 'other',
      breeds: ['other'],
      availability: 'Not Available',
    }, {
      pic: pic1,
      date_created: new Date('06-20-2018'),
      description:
        "A very good dog. Wonderful with children and other animals.",
      news_item: constants.news1,
      animal_id: 4,
      disposition: ['Good with other animals', 'Good with children', 'Animal must be leashed at all times'].sort(),
      type: 'dog',
      breeds: ['border collie', 'beagle'].sort(),
      availability: 'Pending',
    }
  ]
}

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

//async forEach method
async function asyncForEach(array, cb) {
  for (let i = 0; i < array.length; i++) {
    await cb(array[i], i, array);
  }
}

describe('animalsModel', () => {
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

  describe('addAnimal(animalObj)', () => {
    it('adds an animal to an empty db', async () => {
      let animalList = await getTestAnimals();
      let dbTestAnimals = await getExpectedTestAnimals();
      const shouldGet = dbTestAnimals[0];
      let animal = animalList[0]
      let animal_id = await Animals.addAnimal(animal)
      animal_id = animal_id[0]

      const animals = await db('animals')
      let animal_db = animals[0];
      //converts the binary array to a base64string
      animal_db.pic = atob(animal_db.pic);

      const animal_dis = await Dispositions.getAnimalDispositions(1)
      animal_db.disposition = []
      animal_dis.forEach(dis => {
        animal_db.disposition.push(dis.disposition)
      })
      animal_db.disposition.sort();


      const animal_breeds = await Breeds.getAnimalBreeds(1);
      animal_db.breeds = []
      animal_breeds.forEach(breed => {
        animal_db.breeds.push(breed.breed);
      })
      animal_db.breeds.sort();

      const animal_type = await Types.getAnimalType(1);
      animal_db.type = animal_type.type;

      const animal_avail = await Avail.getAnimalAvail(1);
      animal_db.availability = animal_avail;


      expect(animal_db).toEqual(shouldGet);
    })

    it('adds an animal to a non-empty db', async () => {
      let list = await getTestAnimals();
      let animalList = [list[0], list[1], list[2]]
      let index = 1

      await asyncForEach((animalList), async (animal) => {
        delete animal.disposition;
        delete animal.breeds;
        delete animal.type;
        delete animal.availability;
        await db('animals').insert(animal);
        await db('animal_dispositions').insert({ animal_id: index, disposition_id: index })
        index++;
      })

      await Animals.addAnimal(list[3]);
      const animals = await db('animals');

      expect(animals).toHaveLength(4);
    })
  })

  describe('editAnimal(animal_id, animalEdits)', () => {
    it('edits an animal in a db with 1 entry', async () => {
      let animals = await getTestAnimals();
      let animal = animals[0]
      delete animal.disposition
      delete animal.breeds;
      delete animal.type;
      delete animal.availability;
      await db('animals').insert(animal)
      await db('animal_dispositions').insert({ animal_id: 1, disposition_id: 1 })
      await db('animal_dispositions').insert({ animal_id: 1, disposition_id: 2 })
      await db('animal_availability').insert({ animal_id: 1, availability_id: 2 });
      await db('animal_breeds').insert({ animal_id: 1, breed_id: 3 })
      await db('animal_type').insert({ animal_id: 1, type_id: 1 });
      const dbTestAnimals = await getExpectedTestAnimals();

      let expectedAnimal = dbTestAnimals[0];
      expectedAnimal.description = "A very lovable dog";

      const count = await Animals.editAnimal(1, {
        description: "A very lovable dog"
      })
      const animals_db = await db('animals');
      let animal_db = animals_db[0]
      animal_db.pic = atob(animal_db.pic);

      const animal_dis = await Dispositions.getAnimalDispositions(1)
      animal_db.disposition = []
      animal_dis.forEach(dis => {
        animal_db.disposition.push(dis.disposition)
      })

      const animal_breeds = await Breeds.getAnimalBreeds(1);
      animal_db.breeds = []
      animal_breeds.forEach(breed => {
        animal_db.breeds.push(breed.breed);
      })
      animal_db.breeds.sort();

      const animal_type = await Types.getAnimalType(1);
      animal_db.type = animal_type.type;

      const animal_avail = await Avail.getAnimalAvail(1);
      animal_db.availability = animal_avail;

      expect(count).toBe(1);
      expect(animal_db.disposition).toEqual(expect.arrayContaining(expectedAnimal.disposition))
      expect(animal_db.description).toEqual(expectedAnimal.description)
    })

    it('edits an animal in a db with more than 1 entry', async () => {
      const description = 'Great bird to make you feel like snow white'

      await insertAnimals();
      await insertAnimalAvail();
      await insertAnimalBreed();
      await insertAnimalDispositions();
      await insertAnimalType();

      let expectedAnimals = await getExpectedTestAnimals();
      let expectedAnimal = expectedAnimals[2]
      expectedAnimal.description = description

      const count = await Animals.editAnimal(3, {
        description
      })
      expect(count).toBe(1)

      let animals = await db('animals').where({ animal_id: 3 });
      let dbAnimal = animals[0];
      dbAnimal.pic = atob(dbAnimal.pic)

      const animal_dis = await Dispositions.getAnimalDispositions(3)
      dbAnimal.disposition = []
      animal_dis.forEach(dis => {
        dbAnimal.disposition.push(dis.disposition)
      })

      const animal_breeds = await Breeds.getAnimalBreeds(3);
      dbAnimal.breeds = []
      animal_breeds.forEach(breed => {
        dbAnimal.breeds.push(breed.breed);
      })
      dbAnimal.breeds.sort();

      const animal_type = await Types.getAnimalType(3);
      dbAnimal.type = animal_type.type;

      const animal_avail = await Avail.getAnimalAvail(3);
      dbAnimal.availability = animal_avail;

      expect(expectedAnimal).toEqual(dbAnimal)
    })
  })

  describe('getAllAnimals()', () => {
    it('gets a list of animals in a populated database', async () => {
      let animals = await getTestAnimals();
      let expectedAnimals = await getExpectedTestAnimals();

      await insertAnimals()
      await insertAnimalDispositions()
      await insertAnimalBreed();
      await insertAnimalAvail();
      await insertAnimalType()

      let dbAnimals = await Animals.getAllAnimals();
      expect(dbAnimals.length).toBe(4);

      await asyncForEach(dbAnimals, async (animal) => {
        animal.pic = atob(animal.pic);
        animal.disposition.sort()
        animal.breeds.sort();
      })

      expect(dbAnimals).toEqual(expectedAnimals);

    })

    it('returns an empty array when trying to get an animal_id that is not in the database ', async () => {
      let animal = await Animals.getAllAnimals()
      expect(animal).toEqual([])
    })
  })

  describe('getAnimalAttribute(attribute)', ()=>{
    it('gets a list of breeds', async ()=>{
      let animals = await getTestAnimals();
      let expectedAnimals = await getExpectedTestAnimals();

      await insertAnimals()
      await insertAnimalDispositions()
      await insertAnimalBreed();
      await insertAnimalAvail();
      await insertAnimalType()

      let animalsArr = await Animals.getAnimalAttribute('breeds');
      expect(animalsArr.length).toBe(48)
      expect(animalsArr[0].breed).toEqual('australian shepherd')
    })

    it('gets a list of dispostions', async ()=>{
      let animals = await getTestAnimals();
      let expectedAnimals = await getExpectedTestAnimals();

      await insertAnimals()
      await insertAnimalDispositions()
      await insertAnimalBreed();
      await insertAnimalAvail();
      await insertAnimalType()

      let animalsArr = await Animals.getAnimalAttribute('dispositions');
      expect(animalsArr.length).toBe(3)
      expect(animalsArr[0].disposition).toEqual('Good with children')
    })

    it('gets a list of types', async ()=>{
      let animals = await getTestAnimals();
      let expectedAnimals = await getExpectedTestAnimals();

      await insertAnimals()
      await insertAnimalDispositions()
      await insertAnimalBreed();
      await insertAnimalAvail();
      await insertAnimalType()

      let animalsArr = await Animals.getAnimalAttribute('types');
      expect(animalsArr.length).toBe(3)
      expect(animalsArr[0].type).toEqual('dog')
    })

    it('gets a list of dates', async ()=>{
      let animals = await getTestAnimals();
      let expectedAnimals = await getExpectedTestAnimals();

      await insertAnimals()
      await insertAnimalDispositions()
      await insertAnimalBreed();
      await insertAnimalAvail();
      await insertAnimalType()

      let animalsArr = await Animals.getAnimalAttribute('date');
      expect(animalsArr.length).toBe(4)
      expect(animalsArr[0].date_created).toEqual('6-20-2021')
    })

    it('gets returns an empty array when it does not recognize the key', async ()=>{
      let animals = await getTestAnimals();
      let expectedAnimals = await getExpectedTestAnimals();

      await insertAnimals()
      await insertAnimalDispositions()
      await insertAnimalBreed();
      await insertAnimalAvail();
      await insertAnimalType()

      let animalsArr = await Animals.getAnimalAttribute('other');
      expect(animalsArr.length).toBe(0)
    })
  })

  describe('getAnimalBy(filterName, filterValue)', () => {
    it('gets a list of animals in a populated database by their animal_id', async () => {
      let animals = await getTestAnimals();
      let expectedAnimals = await getExpectedTestAnimals();

      await insertAnimals()
      await insertAnimalDispositions()
      await insertAnimalBreed();
      await insertAnimalAvail();
      await insertAnimalType()

      let dbAnimals = await db('animals');
      expect(dbAnimals.length).toBe(4);

      let animal = await Animals.getAnimalBy('animal_id', 1);
      let animal_db = animal[0]
      animal_db.pic = atob(animal_db.pic);

      const animal_dis = await Dispositions.getAnimalDispositions(1)
      animal_db.disposition = []
      animal_dis.forEach(dis => {
        animal_db.disposition.push(dis.disposition)
      })
      const animal_breeds = await Breeds.getAnimalBreeds(1);
      animal_db.breeds = []
      animal_breeds.forEach(breed => {
        animal_db.breeds.push(breed.breed);
      })
      animal_db.breeds.sort();

      const animal_type = await Types.getAnimalType(1);
      animal_db.type = animal_type.type;

      const animal_avail = await Avail.getAnimalAvail(1);
      animal_db.availability = animal_avail;

      expect(animal_db).toEqual(expectedAnimals[0])

    })

    it('returns an empty array when trying to get an animal_id that is not in the database ', async () => {
      let animal5 = await Animals.getAnimalBy('animal_id', 1);
      expect(animal5).toEqual([])
    })

    it('gets a list of animals in a populated database by their date created', async () => {
      let expectedAnimals = await getExpectedTestAnimals();

      await insertAnimals()
      await insertAnimalDispositions()
      await insertAnimalBreed();
      await insertAnimalAvail();
      await insertAnimalType()

      let dbAnimals = await db('animals');
      expect(dbAnimals.length).toBe(4);

      let animal = await Animals.getAnimalBy('date', '06-20-2021')
      let animal_db = animal[0]
      animal_db.pic = atob(animal_db.pic)

      const animal_dis = await Dispositions.getAnimalDispositions(1)
      animal_db.disposition = []
      animal_dis.forEach(dis => {
        animal_db.disposition.push(dis.disposition)
      })
      const animal_breeds = await Breeds.getAnimalBreeds(1);
      animal_db.breeds = []
      animal_breeds.forEach(breed => {
        animal_db.breeds.push(breed.breed);
      })
      animal_db.breeds.sort();

      const animal_type = await Types.getAnimalType(1);
      animal_db.type = animal_type.type;

      const animal_avail = await Avail.getAnimalAvail(1);
      animal_db.availability = animal_avail;

      expect(animal_db).toEqual(expectedAnimals[0])
    })

    it('returns an empty array when trying to get an animal by a date created that does not exist', async () => {
      let animal = await Animals.getAnimalBy('date', '06-20-1900')
      expect(animal).toEqual([]);
    })

    it('gets a list of animal_ids in a populated database by their disposition', async () => {
      await insertAnimals()
      await insertAnimalDispositions()
      await insertAnimalBreed();
      await insertAnimalAvail();
      await insertAnimalType()

      let dbAnimals = await db('animals');
      expect(dbAnimals.length).toBe(4);

      let animals_by_disId = await Animals.getAnimalBy('disposition', 'Good with other animals')
      expect(animals_by_disId.length).toBe(3);

      expect(animals_by_disId).toEqual(expect.arrayContaining([{ animal_id: 1 }, { animal_id: 2 }, { animal_id: 4 }]))

    })

    it('returns an empty array when trying to filter by disposition not in database', async () => {
      let animal = await Animals.getAnimalBy('disposition', 'Good with other animals')
      expect(animal).toEqual([]);
    })

    it('gets a list of animal_ids in a populated database by their type', async () => {
      await insertAnimals()
      await insertAnimalDispositions()
      await insertAnimalBreed();
      await insertAnimalAvail();
      await insertAnimalType()

      let dbAnimals = await db('animals');
      expect(dbAnimals.length).toBe(4);

      const animal_list = await Animals.getAnimalBy('type', 'dog')
      expect(animal_list.length).toBe(2)
      expect(animal_list).toEqual([{ animal_id: 1 }, { animal_id: 4 }])

    })

    it('returns an empty array when trying to filter by type not in database', async () => {
      let animal = await Animals.getAnimalBy('type', 'dog')
      expect(animal).toEqual([]);
    })

    it('gets a list of animal_ids in a populated database by their breed', async () => {
      await insertAnimals()
      await insertAnimalDispositions()
      await insertAnimalBreed();
      await insertAnimalAvail();
      await insertAnimalType()

      const dbAnimals = await db('animals');
      expect(dbAnimals.length).toBe(4);

      const animal = await Animals.getAnimalBy('breed', 'other')
      expect(animal.length).toBe(2)
      expect(animal).toEqual([{ animal_id: 2 }, { animal_id: 3 }])
    })

    it('returns an empty array when trying to filter by breed not in database', async () => {
      let animal = await Animals.getAnimalBy('breed', 'other')
      expect(animal).toEqual([]);
    })

    it('gets a list of animal_ids in a populated database by their availability', async () => {
      await insertAnimals()
      await insertAnimalDispositions()
      await insertAnimalBreed();
      await insertAnimalAvail();
      await insertAnimalType()

      const dbAnimals = await db('animals');
      expect(dbAnimals.length).toBe(4);

      const animal = await Animals.getAnimalBy('availability', 'Available')
      expect(animal.length).toEqual(1);
      expect(animal).toEqual([{ animal_id: 1 }])
    })

    it('returns an empty array when trying to filter by availability not in database', async () => {
      let animal = await Animals.getAnimalBy('availability', 'Available')
      expect(animal).toEqual([]);
    })
  })

  describe('deteleAnimal(animal_id)', () => {
    it('deletes single animal from database holding 1 animal', async () => {
      let animals = await getTestAnimals();
      let animal = animals[0]
      delete animal.disposition
      delete animal.breeds;
      delete animal.type;
      delete animal.availability;

      await db('animals').insert(animal)
      await db('animal_dispositions').insert({ animal_id: 1, disposition_id: 1 })
      await db('animal_dispositions').insert({ animal_id: 1, disposition_id: 2 })
      await db('animal_availability').insert({ animal_id: 1, availability_id: 2 });
      await db('animal_breeds').insert({ animal_id: 1, breed_id: 3 })
      await db('animal_type').insert({ animal_id: 1, type_id: 1 });

      let dbAnimals = await db('animals');
      expect(dbAnimals.length).toBe(1);
      let dbDis = await db('dispositions')
      expect(dbDis.length).toBe(3);
      let db_a_dis = await db('animal_dispositions');
      expect(db_a_dis.length).toBe(2);
      let dbAvail = await db('availability');
      expect(dbAvail.length).toBe(4);
      let db_a_avail = await db('animal_availability')
      expect(db_a_avail.length).toBe(1);
      let db_type = await db('types');
      expect(db_type.length).toBe(3);
      let db_a_type = await db('animal_type');
      expect(db_a_type.length).toBe(1);
      let dbBreed = await db('breeds');
      expect(dbBreed.length).toBe(48);
      let db_a_breed = await db('animal_breeds')
      expect(db_a_breed.length).toBe(1)

      const count = await Animals.deleteAnimal(1)
      dbAnimals = await db('animals');
      expect(count).toBe(1);
      expect(dbAnimals).toEqual([]);
      db_a_dis = await db('animal_dispositions');
      expect(db_a_dis.length).toBe(0);
      db_a_avail = await db('animal_availability')
      expect(db_a_avail.length).toBe(0);
      db_a_type = await db('animal_type');
      expect(db_a_type.length).toBe(0);
      db_a_breed = await db('animal_breeds')
      expect(db_a_breed.length).toBe(0)

      dbDis = await db('dispositions')
      expect(dbDis.length).toBe(3);
      dbAvail = await db('availability');
      expect(dbAvail.length).toBe(4);
      dbBreed = await db('breeds');
      expect(dbBreed.length).toBe(48);
      db_type = await db('types');
      expect(db_type.length).toBe(3);
    })

    it('deletes single animal from populated database', async () => {
      await insertAnimals();
      await insertAnimalAvail();
      await insertAnimalBreed();
      await insertAnimalDispositions();
      await insertAnimalType();

      let dbAnimals = await db('animals');
      expect(dbAnimals.length).toBe(4);

      const count = await Animals.deleteAnimal(1)
      dbAnimals = await db('animals');

      expect(count).toBe(1);
      expect(dbAnimals.length).toBe(3);

      dbAnimals = await db('animals').where({ animal_id: 1 });
      expect(dbAnimals.length).toBe(0);
    })

    it('returns 0 when trying to delete an animal that does not exist in the', async () => {
      const count = await Animals.deleteAnimal(1)
      expect(count).toBe(0);
    })
  })
})

module.exports = {
  getTestAnimals, getExpectedTestAnimals, asyncForEach,
}