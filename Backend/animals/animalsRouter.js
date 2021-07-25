const router = require("express").Router();
const Animals = require('./animalsModel');
const Dispositions = require('../dispositions/dispositionsModel')
const helpers = require('./animalHelpers');
const atob = require('atob')

router.get('/', (req, res) => {
    Animals.getAllAnimals().then(animals => {
        animals.forEach(animal => {
            animal.pic = atob(animal.pic)
        })
        res.status(200).json({ animals })
    }).catch(err => {
        res.status(500).json({
            error: err.message,
            errorMessage: 'Could not retrieve animals',
            stack: 'Animal Router line 13'
        })
    })
})

router.get('/:filter_name/:filter_value', (req, res) => {
    let filter = req.params.filter_name;
    let value = req.params.filter_value;
    value = value.split('_').join(' ')

    Animals.getAnimalBy(filter, value).then(animalArr => {
        if (animalArr.length > 0 && animalArr[0].pic) {
            animalArr.forEach(animal => {
                animal.pic = atob(animal.pic)
            })
        }
        res.status(200).json({ animalArr })
    }).catch(err => {
        res.status(500).json({
            error: err.message,
            errorMessage: 'Can not  get the animal from the database',
            stack: 'Animal router line 35'
        })
    })
})

//Edits animal attributes
router.put('/:animal_id', helpers.validateAnimalEdit, (req, res) => {
    let animal_edits = req.body

    Animals.getAnimalBy('animal_id', req.params.animal_id).then(animalArr => {
        let animal = animalArr[0]
        if (animal) {
            Animals.editAnimal(req.params.animal_id, animal_edits).then(count => {
                res.status(200).json({ message: `Edited ${count} key(s) successfully` })
            }).catch(err => {
                res.status(500).json({
                    error: err.message,
                    errorMessage: "Could not edit animal in database",
                    stack: "Animals Router line 42"
                })
            })
        } else {
            res.status(404).json({
                message: "No animal with that id",
                stack: 'Animals Router line 48'
            })
        }
    }).catch(err => {
        res.status(500).json({
            error: err.message,
            errorMessage: "Could not retrieve animal from database",
            stack: "Animals Router line 55"
        })
    })
})


router.post('/', helpers.validateAnimal, (req, res) => {
    let animal = req.body

    Animals.addAnimal(animal).then(animalArr => {
        res.status(201).json({ animal: animalArr[0] })
    }).catch(err => {
        res.status(500).json({
            error: err.message,
            errorMessage: "Could not add animal to database",
            stack: "Animals Router line 76"
        })
    })
})

router.delete('/:animal_id', (req, res) => {
    let animal_id = req.params.animal_id
    Animals.getAnimalBy('animal_id', animal_id).then(animalArr => {
        if (animalArr.length === 1) {
            Animals.deleteAnimal(animal_id).then(count => {
                res.status(200).json({ message: `${count} deleted successfully` })
            }).catch(err => {
                res.status(500).json({
                    error: err.message,
                    errorMessage: "Could not delete animal by their id",
                    stack: 'Animal router line 82'
                })
            })
        } else {
            res.status(404).json({ message: 'No animal with that id was found' })
        }
    }).catch(err => {
        res.status(500).json({
            error: err.message,
            errorMessage: "Could not get animal by their id",
            stack: 'Animal router line 92'
        })
    })
})

router.delete('/:animal_id/:key/:key_id', (req, res) =>{
    const animal_id = req.params.animal_id;
    const key = req.params.key;
    const key_id = req.params.key_id;

    Animals.getAnimalBy('animal_id', animal_id).then(animalArr => {
        if(animalArr.length > 0 ){
            Animals.deleteAnimalKey(animal_id, key, key_id).then(count => {
                res.status(200).json({ message: `${count} key(s) deleted successfully` })
            }).catch(err => {
                res.status(500).json({
                    error: err.message,
                    errorMessage: "Could not delete key from the animal  by the ids",
                    stack: 'Animal router line 125'
                })
            })
        }else {
            res.status(404).json({ message: 'No animal with that id was found' })
        }
    }).catch(err => {
        res.status(500).json({
            error: err.message,
            errorMessage: "Could not get animal by their id",
            stack: 'Animal router line 120'
        })
    })
})

module.exports = router;
