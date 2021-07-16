const db = require('../db/dbconfig');

module.exports = {
    addDisposition,
    addAnimalDisposition,
    editDisposition,
    getAnimalByDispositionId,
    getDispositionId,
    deleteDisposition,
    deleteAnimalDiposition
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

//gets animals based on a particular disposition
function getAnimalByDispositionId(disposition_id) {
    return db('animals as a').join('animal_dispositions as ad', 'a.animal_id', 'ad.animal_id').join('dispositions as d', 'd.disposition_id', 'ad.disposition_id').where('d.disposition_id', disposition_id)
 }

//get a disposition and returns the id
function getDispositionId(disposition) {
    return db('dispositions').where({disposition}).select('disposition_id');
 }

//delete a disposition
function deleteDisposition(disposition_id) { 
    return db('dispositions').del().where({disposition_id})
}

//removes a disposition from an animal object
function deleteAnimalDiposition(disposition_id, animal_id) {
    return db('animal_dispositions').del().where({disposition_id, animal_id})
 }