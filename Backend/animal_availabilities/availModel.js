const db = require('../db/dbconfig');

module.exports = {
    addAvail,
    addAnimalAvail,
    editAvail,
    editAnimalAvail,
    getAnimalAvail,
    getAnimalAvailByAvailId,
    getAvailId,
    deleteAvail,
    deleteAnimalAvails
}

//adds an availability
function addAvail(availability){
    return db('availability').insert({availability}, 'availability_id')
}

//relates an avail to an animal object
function addAnimalAvail(animal_id, availability_id){
    return db('animal_availability').insert({animal_id, availability_id}, 'animal_availability_id')
}

//edits an availability
function editAvail(availability_id, availability){
    return db('availability').where({availability_id}).update({availability}).then(count => count);
}

//edits an animal's availability
async function editAnimalAvail(editObj){
    let {animal_id, availability_id, availability} = editObj
    animal_id = parseInt(animal_id)
    availability_id = parseInt(availability_id)

    if(availability_id){
        await db('animal_availability').del().where({animal_id: animal_id, availability_id: availability_id})
    } else {
        await db('animal_availability').del().where({animal_id: animal_id})

    }
    const new_avail_id = await getAvailId(availability);

    return db('animal_availability').insert({animal_id: animal_id, availability_id: new_avail_id}, 'animal_availability_id')
    
}

// returns the availability of a particular animal
async function getAnimalAvail(animal_id){
    const avail =  await db('availability as a').join('animal_availability as aa', 'a.availability_id', 'aa.availability_id').where('aa.animal_id', animal_id).select('a.availability').first();
    return avail.availability
}

//returns list of animal ids based on a particular availability
async function getAnimalAvailByAvailId(availability_id){
    return db('animal_availability as aa').join('availability as a', 'a.availability_id', 'aa.availability_id').where('a.availability_id', availability_id).select('aa.animal_id');
}

//returns the id of an availability
async function getAvailId(availability){
    const availArr = await db('availability').where({availability});
    if(availArr.length > 0){
        return availArr[0].availability_id
    }
    return
}

//delete an availability
async function deleteAvail(availability_id){
    return db('availability').del().where({availability_id});
}

//removes an availability from an animal object
function deleteAnimalAvails(animal_id){
    return db('animal_availability').del().where({animal_id})
}