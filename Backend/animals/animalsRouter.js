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

module.exports = router;
