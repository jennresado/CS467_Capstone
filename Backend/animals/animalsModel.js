const db = require("../db/dbconfig");
const Avail = require('../animal_availabilities/availModel')
const Breeds = require('../breeds/breedsModel')
const Dispositions = require('../dispositions/dispositionsModel')
const Types = require('../types/typesModel')

module.exports = {
  addAnimal,
  editAnimal,
  getAllAnimals,
  getAnimalBy,
  deleteAnimal,
  deleteAnimalKey
};

async function asyncForEach(array, cb) {
  for (let i = 0; i < array.length; i++) {
    await cb(array[i], i, array);
  }
}

//adds an animal to the database
async function addAnimal(animal) {
  let disposition = animal.disposition;
  let breeds = animal.breeds;
  let type = animal.type;
  let avail = animal.availability

  delete animal.disposition;
  delete animal.breeds;
  delete animal.type;
  delete animal.availability;

  const id = await db("animals").insert(animal, "animal_id");

  await asyncForEach(disposition, async (dis) => {
    const dis_id = await Dispositions.getDispositionId(dis)
    await Dispositions.addAnimalDisposition(id[0], dis_id)
  })

  await asyncForEach(breeds, async (breed) => {
    const breed_id = await Breeds.getBreedId(breed);
    await Breeds.addAnimalBreed(id[0], breed_id)
  })

  const type_id = await Types.getTypeId(type)
  await Types.addAnimalType(id[0], type_id);

  const avail_id = await Avail.getAvailId(avail);
  await Avail.addAnimalAvail(id[0], avail_id)
  return id;
}

//edits animal with the given id
async function editAnimal(animal_id, animalEdits) {
  let sum = 0

  for (const key in animalEdits) {
    switch (key) {
      case 'active':
        await db('animals').where({ animal_id }).update({ active: animalEdits[key] })
        sum++;
        break;
      case 'availability':
        await Avail.editAnimalAvail({ animal_id: animal_id, availability: animalEdits[key] })
        sum++;
        break;
      case 'breeds':
        await editAnimalBreeds(animal_id, animalEdits[key])
        sum++;
        break;
      case 'date':
        await db('animals').where({ animal_id }).update({ date_created: animalEdits[key] })
        sum++;
        break;
      case 'description':
        await db('animals').where({ animal_id }).update({ description: animalEdits[key] })
        sum++;
        break;
      case 'disposition':
        await editDisp(animal_id, animalEdits['disposition']);
        sum++;
        break;
      case 'news_item':
        await db('animals').where({ animal_id }).update({ news_item: animalEdits[key] })
        sum++;
        break;
      case 'type':
        await Types.editAnimalType({ animal_id, type: animalEdits[key] })
        sum++;
        break;
    }
  }
  return sum;
}

//process the information before sending it to the appropiate function to edit the animal attribtue
async function editDisp(animal_id, editObj) {
  let obj = { animal_id }
  for (const key in editObj) {
    obj.disposition_id = editObj[key]
    obj.disposition = key
    await Dispositions.editAnimalDispositions(obj)
  }
}

async function editAnimalBreeds(animal_id, editObj) {
  let obj = { animal_id }
  for (const key in editObj) {
    obj.breed_id = editObj[key]
    obj.breed = key;
    await Breeds.editAnimalBreed(obj)
  }
}

//returns an array of all the animal objects in the database
async function getAllAnimals() {
  const db_a = await db('animals');
  await asyncForEach(db_a, async (animal) => {
    let a_dis = await Dispositions.getAnimalDispositions(animal.animal_id)
    animal.disposition = []
    a_dis.forEach(dis => {
      animal.disposition.push(dis.disposition)
    })

    let a_breeds = await Breeds.getAnimalBreeds(animal.animal_id);
    animal.breeds = []
    a_breeds.forEach(breed => {
      animal.breeds.push(breed.breed);
    })

    let type = await Types.getAnimalType(animal.animal_id)
    animal.type = type.type;

    animal.availability = await Avail.getAnimalAvail(animal.animal_id)
  })
  return db_a
}

//returns animal object corresponding the the given filter and filter value
async function getAnimalBy(filterName, filterValue) {
  let db_a = []
  switch (filterName) {
    case "animal_id":
      db_a = await db("animals").where({ animal_id: filterValue });
      break;
    case "date":
      db_a = await db("animals").where({ date_created: filterValue });
      break;
    case "disposition":
      const dis_id = await Dispositions.getDispositionId(filterValue)
      return Dispositions.getAnimalByDispositionId(dis_id)
    case "type":
      const type_id = await Types.getTypeId(filterValue);
      return Types.getAnimalByTypeId(type_id);
    case "breed":
      const breed_id = await Breeds.getBreedId(filterValue);
      return Breeds.getAnimalByBreedId(breed_id)
    case "availability":
      filterValue = capitalize(filterValue)
      const avail_id = await Avail.getAvailId(filterValue);
      return Avail.getAnimalAvailByAvailId(avail_id)
  }

  await asyncForEach(db_a, async (animal) => {
    let a_dis = await Dispositions.getAnimalDispositions(animal.animal_id)
    animal.disposition = []
    a_dis.forEach(dis => {
      animal.disposition.push(dis.disposition)
    })
  })

  return db_a
}

//removes aniaml with given id from database
async function deleteAnimal(animal_id) {
  return db("animals").del().where({ animal_id });
}

//removes a particular key on an animal object
async function deleteAnimalKey(animal_id, key, key_id){
  animal_id = parseInt(animal_id);
  key_id = parseInt(key_id)
  
  switch(key){
    case 'disposition':
      return db('animal_dispositions').del().where({ animal_id, disposition_id: key_id})
    case 'breeds':
      return db('animal_breeds').del().where({ animal_id, breed_id: key_id})
  }
}

function capitalize(sentence) {
  let sep_word = sentence.toLowerCase().split(' ');
  for (let i = 0; i < sep_word.length; i++) {
    sep_word[i] = sep_word[i].charAt(0).toUpperCase() + sep_word[i].substring(1)
  }
  return sep_word.join(' ')
}