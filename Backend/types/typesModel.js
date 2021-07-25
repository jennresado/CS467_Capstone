const db = require('../db/dbconfig');

module.exports = {
    addType,
    addAnimalType,
    editType,
    editAnimalType,
    getAnimalType,
    getAnimalByTypeId,
    getTypeId,
    deleteType,
    deleteAnimalType
}

//adds a type
function addType(type){
    return db('types').insert({type}, 'type_id')
}

//relates a type to an animal object
function addAnimalType(animal_id, type_id){
    return db('animal_type').insert({animal_id, type_id}, 'animal_type_id')
}

//edits a type
function editType(type_id, type){
    return db('types').where({type_id}).update({type}).then(count => count);
}

//edits an animal's type
async function editAnimalType(editObj){
    let {animal_id, type} = editObj;
    animal_id = parseInt(animal_id)

    await db('animal_type').del().where({animal_id});

    const new_type_id = await getTypeId(type);

    return db('animal_type').insert({animal_id, type_id: new_type_id}, 'animal_type_id')
}

//gets the type of a particular animal
function getAnimalType(animal_id){
    return db('types as t').join('animal_type as at', 't.type_id', 'at.type_id').where('at.animal_id', animal_id).first();
}

//gets list of animal ids based on a particular type
async function getAnimalByTypeId(type_id){
    return db('animal_type as at').join('types as t', 'at.type_id', 't.type_id').where('t.type_id', type_id).select('at.animal_id')
}

//returns the id of a type
async function getTypeId(type){
    const typeArr = await db('types').where({type});
    if(typeArr.length > 0){
        return typeArr[0].type_id
    }
    return 
}

// deletes a type
function deleteType(type_id){
    return db('types').del().where({type_id});
}

//removes a type from an animal object
function deleteAnimalType(animal_id){
    return db('animal_type').del().where({animal_id})
}