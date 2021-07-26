const db = require('../db/dbconfig');

module.exports = {
    addBreed, 
    addAnimalBreed,
    editBreed,
    editAnimalBreed, 
    getAnimalBreeds, 
    getAnimalByBreedId,
    getBreedId,
    deleteBreed,
    deleteAnimalBreeds
}

//adds a breed 
function addBreed(breed){
    return db('breeds').insert({breed}, 'breed_id')
}

// relates a breed to an animal object 
function addAnimalBreed(animal_id, breed_id){
    return db('animal_breeds').insert({animal_id, breed_id}, 'animal_breeds_id')
}

//edits a breed
function editBreed(breed_id, breed){
    return db('breeds').where({breed_id}).update({breed}).then(count => count);
}

//edits an animal's breed
async function editAnimalBreed(editObj){
    let {animal_id, breed_id, breed} = editObj;
    animal_id = parseInt(animal_id)
    breed_id = parseInt(breed_id)

    await db('animal_breeds').del().where({animal_id: animal_id, breed_id: breed_id})

    const new_breed_id = await getBreedId(breed);

    return db('animal_breeds').insert({animal_id: animal_id, breed_id: new_breed_id }, 'animal_breeds_id')
}

//gets all the breeds for a particular animal
function getAnimalBreeds(animal_id){
    return db('breeds as b').join('animal_breeds as ab', 'b.breed_id', 'ab.breed_id').where('ab.animal_id', animal_id)
}

//returns list of animal ids based on a particular breed
async function getAnimalByBreedId(breed_id){
    return db('animal_breeds as ab').join('breeds as b', 'b.breed_id', 'ab.breed_id').where('b.breed_id', breed_id).select('ab.animal_id');
}

// returns the id of a breed
async function getBreedId(breed){
    const breedArr = await db('breeds').where({breed});
    if(breedArr.length > 0){
        return breedArr[0].breed_id
    }
    return
}

//delete a breed
function deleteBreed(breed_id){
    return db('breeds').del().where({breed_id})
}

//removes a breed from an animal object
function deleteAnimalBreeds(animal_id){
    return db('animal_breeds').del().where({animal_id})
}