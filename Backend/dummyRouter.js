const router = require('express').Router();
const animalObj = require('./animals/animalObj')

const animalArr = animalObj.animalObj

//get all animals 
router.get('/', (req, res) => {
    res.status(200).json({animals: animalArr})
})

//get by id
router.get('/animal_id/1', (req, res) => {
    animalArr2 = []
    animalArr2.push(animalArr[0])

    res.status(200).json({animalArr: animalArr2})
})

//get by date
router.get('/date/01-10-2021', (req, res) => {
    animalArr2 = []
    animalArr2.push(animalArr[1])

    res.status(200).json({animalArr: animalArr2})
})

//get by type
router.get('/type/dog', (req, res) => {
    animalArr2 = []
    animalArr2.push(animalArr[0])
    animalArr2.push(animalArr[3])

    res.status(200).json({animalArr: animalArr2})
})

//get by breed
router.get('/breed/calico', (req, res) => {
    animalArr2 = []
    animalArr2.push(animalArr[1])

    res.status(200).json({animalArr: animalArr2})
})

//get by availability
router.get('/avail/not_available', (req, res) => {
    animalArr2 = []
    animalArr2.push(animalArr[2])

    res.status(200).json({animalArr: animalArr2})
})

router.get('/avail/available', (req, res) => {
    animalArr2 = []
    animalArr2.push(animalArr[0])

    res.status(200).json({animalArr: animalArr2})
})

router.get('/avail/pending', (req, res) => {
    animalArr2 = []
    animalArr2.push(animalArr[3])
    animalArr2.push(animalArr[1])

    res.status(200).json({animalArr: animalArr2})
})

//get by disposition
router.get('/disposition/animals', (req, res) => {
    animalArr2 = []
    animalArr2.push(animalArr[0])
    animalArr2.push(animalArr[1])

    res.status(200).json({animalArr: animalArr2})
})

router.put('/:animal_id', (req, res) => {
    res.status(200).json({message: 'Edited 1 animal(s) successfully'})
})

router.post('/', (req, res) => {
    res.status(201).json(animalArr[0])
})

router.delete('/:animal_id', (req, res) =>{
    res.status(200).json({message: '1 deleted successfully'})
})

module.exports = router;