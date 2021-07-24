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
async function addAnimal(animal) {
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
  const db_a = await db('animals');
  await asyncForEach(db_a, async (animal) => {
    let a_dis = await Dispositions.getAnimalDispositions(animal.animal_id)
    animal.disposition = []
    a_dis.forEach(dis => {
      animal.disposition.push(dis.disposition)
    })
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
    case "disposition_id":
      return Dispositions.getAnimalByDispositionId(1)
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
