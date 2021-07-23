const db = require('../db/dbconfig');

module.exports = {
    addDisposition,
    addAnimalDisposition,
    editDisposition,
    editAnimalDispositions,
    getAnimalByDispositionId,
    getAnimalDispositions,
    getDispositionId,
    deleteDisposition,
    deleteAnimalDipositions
}

//adds a disposition 
function addDisposition(disposition) {
    return db('dispositions').insert({disposition}, "disposition_id")
}

// relates a disposition to an animal object
function addAnimalDisposition(animal_id, disposition_id) {
    return db('animal_dispositions').insert({ animal_id, disposition_id }, 'animal_dis_id')
}

//edits a disposition
function editDisposition(disposition_id, disposition) {
    return db('dispositions').where({ disposition_id }).update(disposition).then(count => count)
}

//edits an animal's dispositions
async function editAnimalDispositions(editObj){
    const {animal_id, disposition_id, disposition} = editObj;

    await db('animal_dispositions').del().where({animal_id: parseInt(animal_id), disposition_id: parseInt(disposition_id)})
    let dis_id = await getDispositionId(disposition);
    return db('animal_dispositions').insert({animal_id: parseInt(animal_id), disposition_id: dis_id}, 'animal_dis_id')
}

//returns list of animal ids based on a particular disposition
async function getAnimalByDispositionId(disposition_id) {
    return db('animal_dispositions as ad').join('dispositions as d', 'd.disposition_id', 'ad.disposition_id').where('d.disposition_id', disposition_id).select('ad.animal_id')
 }

 //gets all the dispositions for a particular animal
 function getAnimalDispositions(animal_id){
    return db('dispositions as d').join('animal_dispositions as ad', 'd.disposition_id', 'ad.disposition_id').where('ad.animal_id', animal_id)
 }

//get a disposition and returns the id
async function getDispositionId(disposition) {
    const res = await db('dispositions').where({disposition});
    if(res.length > 0){
        return res[0].disposition_id;
    }
    return;
 }

//delete a disposition
function deleteDisposition(disposition_id) { 
    return db('dispositions').del().where({disposition_id})
}

//removes a disposition from an animal object
function deleteAnimalDipositions(animal_id) {
    return db('animal_dispositions').del().where({ animal_id})
 }