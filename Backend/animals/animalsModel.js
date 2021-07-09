const db = require("../db/dbconfig");

module.exports = {
  addAnimal,
  editAnimal,
  getAnimalBy,
  deleteAnimal,
};

//adds an animal to the database
function addAnimal(animal) {
  return db("animals").insert(animal, "animal_id");
}

//edits animal with the given id
function editAnimal(animal_id, animalEdits) {
  return db("animals")
    .where({ animal_id })
    .update(animalEdits)
    .then((count) => count);
}

//returns animal object corresponding the the given filter and filter value
// filterValue is animal_id for cases animal_id, breed and disposition
async function getAnimalBy(filterName, filterValue) {
  switch (filterName) {
    case "animal_id":
      return db("animals").where({ animal_id: filterValue });
    case "type":
      return db("animals").where({ type: filterValue });
    case "breed":
      return db("animal_breeds")
        .join("breeds", "breeds.breed_id", "animal_breeds.breed_id")
        .where({ animal_id: filterValue });
    case "disposition":
      return db("animal_dispositions")
        .join(
          "dispositions",
          "animal_dispositions.disposition_id",
          "dispositions.disposition_id",
        )
        .where({ animal_id: filterValue });
    case "availability":
      return db("animal_availability").join(
        "availability",
        "availability.id",
        "animal_availability.availability.id",
      );
    case "date":
      return db("animals").where({ date_created: filterValue });
  }
}

//removes aniaml with given id from database
function deleteAnimal(animal_id) {
  return db("animals").del().where({ animal_id });
}
