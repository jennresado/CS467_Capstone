const router = require("express").Router();
const Animals = require('./animalsModel');
const helpers = require('./animalHelpers');
const atob = require('atob')

router.get('/', (req, res) =>{
    Animals.getAllAnimals().then(animals => {
        res.status(200).json({animals})
    }).catch(err => {
        res.status(500).json({
            error: err.message, 
            errorMessage: 'Could not retrieve animals',
            stack: 'Animal Router line 13'
        })
    })
})

router.put('/:animal_id', helpers.validateAnimalEdit, (req, res) =>{
    Animals.getAnimalBy('animal_id', req.params.animal_id).then(animalArr => {
        let animal = animalArr[0]
        if(animal){
            Animals.editAnimal(req.params.animal_id, req.body).then(count => {
                res.status(200).json({message: `Edited ${count} animal(s) successfully`})
            }).catch(err => {
                res.status(500).json({
                    error: err.message,
                    errorMessage: "Could not edit animal in database",
                    stack: "Animals Router line 28"
                })
            })
        } else {
            res.status(404).json({
                message: "No animal with that id",
                stack: 'Animals Router line 34'
            })
        }
    }).catch(err => {
        res.status(500).json({
            error: err.message, 
            errorMessage: "Could not retrieve animal from database",
            stack: "Animals Router line 41"
        })
    })
})

router.post('/', helpers.validateAnimal, (req,res) =>{
    Animals.addAnimal(req.body).then(animal => {
        res.status(201).json({animal})
    }).catch(err => {
        res.status(500).json({
            error: err.message,
            errorMessage: "Could not add adnimal to database",
            stack: "Animals Router line 53"
        })
    })
})

module.exports = router;
