const db = require("../db/dbconfig");
const Dispositions = require('../dispositions/dispositionsModel')

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
function addAnimal(animal) {
  let disposition = animal.disposition;
  delete animal.disposition;
  const id = await db("animals").insert(animal, "animal_id");

  await asyncForEach(disposition, async (dis) => {
    const dis_id = await Dispositions.getDispositionId(dis)
    await Dispositions.addAnimalDisposition(id[0], dis_id)
  })
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
  return db('animals');
}

//returns animal object corresponding the the given filter and filter value
// filterValue is animal_id for cases animal_id, breed and disposition
async function getAnimalBy(filterName, filterValue) {
  switch (filterName) {
    case "animal_id":
      return db("animals").where({ animal_id: filterValue });
    case "date":
      return db("animals").where({ date_created: filterValue });
    default:
      return []
  }
}

//removes aniaml with given id from database
function deleteAnimal(animal_id) {
  return db("animals").del().where({ animal_id });
}
