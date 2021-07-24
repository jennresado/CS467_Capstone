const fs = require('fs')
const constants = require("./testConstants");

const dogBuff = fs.readFileSync('animals/collie.jpeg')
const dogPic = dogBuff.toString('base64');

const catBuff = fs.readFileSync('animals/calicoCat.jpg')
const catPic = catBuff.toString('base64');

const birdBuff = fs.readFileSync('animals/macaw.jpg')
const birdPic = birdBuff.toString('base64')

const dog = {
    animal_id: 1, 
    pic: dogPic,
    description:
    "A very good dog. Wonderful with children and other animals. Looking for his forever home.",
    disposition: ['Good with other animals', 'Good with children'],
    type: 'dog',
    breeds: ['Collie'],
    availability: 'Available',
    date_created: new Date('06-20-2019'), 
    news_item: constants.news1
}

const cat = {
    animal_id: 2, 
    pic: catPic,
    description: "A very good cat. Wonderful with other animals. Watch when around children",
    disposition: ['Good with other animals'],
    type: 'cat',
    breeds: ['Calico', 'Tabby'],
    availability: 'Pending',
    date_created: new Date('01-10-2021'), 
    news_item: constants.news2
}

const bird = {
    animal_id: 3, 
    pic: birdPic,
    description: "A very good bird. Good around other birds only",
    disposition: [],
    type: 'other',
    breeds: ['Macaw'],
    availability: 'Not Available',
    date_created: new Date('08-04-2018'), 
    news_item: constants.news1
}

const dog2 = {
    animal_id: 4, 
    pic: dogPic,
    description:
    "An awesome dog to have around",
    disposition: [],
    type: 'dog',
    breeds: ['Collie', 'Sheltie'],
    availability: 'Pending',
    date_created: new Date('10-10-2020'), 
    news_item: constants.news2
}

const animalObj = [dog, cat, bird, dog2]

module.exports ={
    animalObj
} 