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

  await asyncForEach(breeds, async(breed) =>{
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
function editAnimal(animal_id, animalEdits) {
  return db("animals")
    .where({ animal_id })
    .update(animalEdits)
    .then((count) => count);
}

//returns an array of all the animal objects in the database
async function getAllAnimals(){
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
  await Dispositions.deleteAnimalDipositions(animal_id)
  return db("animals").del().where({ animal_id });
}
