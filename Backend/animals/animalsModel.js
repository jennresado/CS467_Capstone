const db = require("../db/dbconfig");

module.exports = {
  addAnimal,
  editAnimal,
  getAllAnimals,
  getAnimalBy,
  deleteAnimal,
};

//adds an animal to the database
function addAnimal(animal) {
  return db("animals").insert(animal, "animal_id").first();
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
