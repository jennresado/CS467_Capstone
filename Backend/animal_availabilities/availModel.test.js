const db = require('../db/dbconfig');
const Avail = require('./availModel');
const constants = require("../animals/testConstants");
const fs = require('fs')
const {asyncForEach} = require('../animals/animalsModel.test')

//sample animals to be used in tests
async function getTestAnimals() {
    let buff = fs.readFileSync('animals/collie.jpeg');
    const pic1 = buff.toString('base64');
    ;
    const animal1 = {
      pic: pic1,
      date_created: "06-20-2021",
      description:
        "A very good dog. Wonderful with children and other animals. Looking for his forever home.",
      news_item: constants.news1,
    };
  
    const animal2 = {
      pic: pic1,
      date_created: "01-01-2020",
      description: "A very good cat. Wonderful with other animals. Watch when around children",
      news_item: constants.news1,
    };
  
    const animal3 = {
      pic: pic1,
      date_created: "01-01-2019",
      description: "A very good bird. Good around other birds only",
      news_item: constants.news1,
    }
  
    const animal4 = {
      pic: pic1,
      date_created: "06-20-2018",
      description:
        "A very good dog. Wonderful with children and other animals.",
      news_item: constants.news1,
    }
  
    return [animal1, animal2, animal3, animal4]
  }

//sample availabilities to be used 
async function getAvail(){
    return [
        "Not Available", "Available", "Pending", "Adopted"
    ]
}

//insert the animals needed
async function insertAnimals(){
    const animals = await getTestAnimals();
    await asyncForEach(animals, async (animal) =>{
        await db('animals').insert(animal)
    })
}

//insert the avail needed 
async function insertAvails(){
    const avails = await getAvail();
    await asyncForEach(avails, async(availability) =>{
        await db('availability').insert({availability})
    })
}

//add the relation between animal and avail
async function insertAnimalAvail(animal_id, availability_id){
    await db('animal_availability').insert({animal_id, availability_id}, 'animal_availability_id')
}

describe('availabilityModel', ()=>{
    beforeEach(async () => {
        //db is the knex initialized object using db.raw to truncate postgres tables with foreign keys
        //can use knex.raw but it is global and deprecated
        await db.raw("TRUNCATE TABLE animals RESTART IDENTITY CASCADE");
        await db.raw("TRUNCATE TABLE users RESTART IDENTITY CASCADE");
        await db.raw("TRUNCATE TABLE user_animals RESTART IDENTITY CASCADE");
        await db.raw("TRUNCATE TABLE breeds RESTART IDENTITY CASCADE");
        await db.raw("TRUNCATE TABLE animal_breeds RESTART IDENTITY CASCADE");
        await db.raw("TRUNCATE TABLE animal_dispositions RESTART IDENTITY CASCADE");
        await db.raw("TRUNCATE TABLE dispositions RESTART IDENTITY CASCADE");
        await db.raw("TRUNCATE TABLE animal_availability RESTART IDENTITY CASCADE");
        await db.raw("TRUNCATE TABLE availability RESTART IDENTITY CASCADE");
        });

    describe('addAvail(availability)', ()=>{
        it('adds an availability to the database', async ()=>{
            let avails = await db('availability')
            expect(avails.length).toBe(0);

            const avail_id = await Avail.addAvail('Pending')
            expect(avail_id).toEqual([1])

            avails = await db('availability')
            expect(avails.length).toBe(1);
            expect(avails[0].availability).toEqual('Pending')
        })
    })

    describe('addAnimalAvail(animal_id, availability_id)', ()=>{
        it('relates an avail to an animal object', async ()=>{
            await insertAnimals();
            const animals = await db("animals")
            expect(animals.length).toBe(4)

            await insertAvails();
            const avail = await db('availability')
            expect(avail.length).toBe(4)

            let animal_avail = await Avail.addAnimalAvail(1, 2);
            expect(animal_avail).toEqual([1])

            animal_avail = await db('animal_availability');
            expect(animal_avail.length).toBe(1)
            expect(animal_avail[0].animal_id).toBe(1)
            expect(animal_avail[0].availability_id).toBe(2)
        })
    })

    describe('editAvail(availability_id, availability)', ()=>{
        it('edits an availability by the availability_id', async ()=>{
            await insertAvails();
            let avail = await db('availability')
            expect(avail.length).toBe(4)
            expect(avail[0].availability).toEqual('Not Available')

            const edit_count = await Avail.editAvail(1, 'Removed')
            expect(edit_count).toBe(1);

            avail = await db('availability')
            expect(avail.length).toBe(4)

            avail = await db('availability').where({availability_id: 1})
            expect(avail[0].availability).toEqual('Removed')
        })

        it('sends a count of 0 when trying to edit an availability with a bad availability_id', async () =>{
            const edit_count = await Avail.editAvail(1, {availability: 'nothing'});
            expect(edit_count).toBe(0);
        })
    })

    describe('editAnimalAvail(editObj)', ()=>{
        it('changes the availability of a particular animal', async ()=>{
            await insertAnimals();
            const animals = await db("animals")
            expect(animals.length).toBe(4)

            await insertAvails();
            const avails = await db('availability');
            expect(avails.length).toBe(4);

            await insertAnimalAvail(1, 1);
            let animal_avail = await db('animal_availability');
            expect(animal_avail.length).toBe(1);

            const editObj = {
                animal_id: 1, 
                availability_id: 1, 
                availability: 'Available'
            }

            const edit_id = await Avail.editAnimalAvail(editObj)
            expect(edit_id[0]).toBe(2);

            animal_avail = await db('animal_availability');
            expect(animal_avail.length).toBe(1);
            expect(animal_avail[0].animal_id).toBe(1)
            expect(animal_avail[0].availability_id).toBe(2);
        })
    })

    describe('getAnimalAvail(animal_id)', ()=>{
        it('returns the availability of an animal based on the animal_id', async ()=>{
            await insertAnimals();
            const animals = await db("animals")
            expect(animals.length).toBe(4)

            await insertAvails();
            const avails = await db('availability');
            expect(avails.length).toBe(4);

            await insertAnimalAvail(1, 2);
            let animal_avail = await db('animal_availability');
            expect(animal_avail.length).toBe(1);

            const animals_avail = await Avail.getAnimalAvail(1);
            expect(animals_avail).toBe('Available')
        })
    })

    describe('getAnimalAvailByAvailId(availability_id)', ()=>{
        it('returns a list of animals that have an availability based on the availability_id', async ()=>{
            await insertAnimals();
            const animals = await db("animals")
            expect(animals.length).toBe(4)

            await insertAvails();
            const avails = await db('availability');
            expect(avails.length).toBe(4);

            await insertAnimalAvail(1, 2);
            await insertAnimalAvail(2, 2);
            await insertAnimalAvail(3, 2);
            await insertAnimalAvail(4, 1);
            let animal_avail = await db('animal_availability');
            expect(animal_avail.length).toBe(4);

            let arr = await Avail.getAnimalAvailByAvailId(2);
            expect(arr.length).toBe(3)
            await asyncForEach(arr, async (obj, i) =>{
                expect(obj.animal_id).toBe(i+1)
            })

            arr = await Avail.getAnimalAvailByAvailId(1);
            expect(arr.length).toBe(1)
            expect(arr[0].animal_id).toBe(4)
        })
    })

    describe('getAvailId(availability)', ()=>{
        it('returns the id of a particular availability string', async ()=>{
            await insertAvails();
            const avails = await db('availability');
            expect(avails.length).toBe(4);

            const avail_list = await getAvail()
            let avail_id = await Avail.getAvailId(avail_list[0])
            expect(avail_id).toBe(1)

            avail_id = await Avail.getAvailId(avail_list[3])
            expect(avail_id).toBe(4)
        })
    })

    describe('deleteAvail(availability_id)', ()=>{
        it('deletes an availability from the database', async ()=>{
            await insertAvails();
            let avails = await db('availability');
            expect(avails.length).toBe(4);

            const count = await Avail.deleteAvail(1);
            expect(count).toBe(1);

            avails = await db('availability');
            expect(avails.length).toBe(3);

            const avail_list = await getAvail();

            let deleted = true;
            avails.forEach(avail =>{
                if(avail.availability === avail_list[0]){
                    deleted = false
                }
            })
            expect(deleted).toBe(true)
        })

        it('returns 0 when trying to delete an availability not in the database', async ()=>{
            const count = await Avail.deleteAvail(1);
            expect(count).toBe(0);
        })
    })

    describe('deleteAnimalAvails(animal_id)', ()=>{
        it('deletes all availabilities from an animal object and returns the count of the number of animal objects affected', async ()=>{
            await insertAnimals();
            const animals = await db("animals")
            expect(animals.length).toBe(4)

            await insertAvails();
            const avails = await db('availability');
            expect(avails.length).toBe(4);

            await insertAnimalAvail(1, 2);
            await insertAnimalAvail(2, 2);
            let animal_avail = await db('animal_availability');
            expect(animal_avail.length).toBe(2);

            const count = await Avail.deleteAnimalAvails(1);
            expect(count).toBe(1);

            animal_avail = await db('animal_availability');
            expect(animal_avail.length).toBe(1);
            expect(animal_avail[0].animal_id).toBe(2)
            expect(animal_avail[0].availability_id).toBe(2)
        })

        it('returns 0 when trying to remove an availability not in the database', async ()=>{
            const count = await Avail.deleteAnimalAvails(1);
            expect(count).toBe(0);
        })
    })

})