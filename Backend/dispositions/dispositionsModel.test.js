const db = require('../db/dbconfig');
const Dispositions = require('./dispositionsModel');
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

//sample dispositions to be used in tests 
 async function getDispositions(){
    const disposition1 = "Good with children";
    const disposition2 = "Good with other animals";
    const disposition3 = "Animal must be leashed at all times";

    return [disposition1, disposition2, disposition3]
}

async function insertDispositions(){
    let disList = ["Good with children", "Good with other animals", "Animal must be leashed at all times"]

    await asyncForEach(disList, async (dis) =>{
        await db('dispositions').insert({disposition: dis})
    })

}

describe('dispositionsModel', ()=>{
    //wipes all tables in database clean so each test starts with empty tables
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
  });

    describe('addDisposition(disposition)', ()=>{
        it('adds a disposition to the database', async () => {
            let disList = await getDispositions();

            await Dispositions.addDisposition(disList[0])

            const dispositions = await db('dispositions');

            expect(dispositions.length).toBe(1);
            expect(dispositions[0]).toEqual({disposition_id: 1, disposition: disList[0]})
        })
    })

    describe('addAnimalDisposition(animal_id, disposition_id)', ()=>{
        it('relates a disposition to an animal object', async()=>{
            const animalList = await getTestAnimals();
            const animal = animalList[0]
            await db('animals').insert(animal);

            const animals = await db('animals');
            expect(animals.length).toBe(1);

            await insertDispositions();
            const dispositions = await db('dispositions');
            expect(dispositions.length).toBe(3);

            const id = await Dispositions.addAnimalDisposition(1, 1);
            const animal_dis = await db('animal_dispositions');
            expect(animal_dis.length).toBe(1);
            expect(id[0]).toBe(1);
        })
    })

    describe('editDisposition(disposition_id, disposition)', () => {
        it('edits a disposition by the disposition_id', async ()=>{
            await insertDispositions();
            let dispositions = await db('dispositions');
            expect(dispositions.length).toBe(3);

            const res = await Dispositions.editDisposition(1, {disposition: 'Good with animals.'})
            expect(res).toBe(1);

            dispositions = await db('dispositions');
            expect(dispositions.length).toBe(3);
            await asyncForEach(dispositions, async(dispo) => {
                if(dispo.disposition_id === 1){
                    expect(dispo.disposition).toEqual('Good with animals.')
                }
            })
            
        })

        it('it sends a count of 0 when trying to edit a disposition with a bad disposition_id', async ()=>{
            const res = await Dispositions.editDisposition(1, {disposition: 'Good with animals.'})
            expect(res).toBe(0);
        })
    })

    describe('editAnimalDisposition(editObj)', ()=>{
        it('changes the disposition of a particular animal', async()=>{
            const animalList = await getTestAnimals();
            const animal = animalList[0]
            await db('animals').insert(animal);

            const animals = await db('animals');
            expect(animals.length).toBe(1);

            await insertDispositions();
            const dispositions = await db('dispositions');
            expect(dispositions.length).toBe(3);

            await db('animal_dispositions').insert({animal_id: 1, disposition_id: 1})
            let animal_dis = await db('animal_dispositions');
            expect(animal_dis.length).toBe(1);
            
            const editObj = {
                animal_id: 1, 
                disposition_id: 1,
                disposition: 'Good with other animals'
            }

            const edit_id = await Dispositions.editAnimalDispositions(editObj)
            expect(edit_id[0]).toBe(2);

            animal_dis = await db('animal_dispositions');
            expect(animal_dis.length).toBe(1);
            expect(animal_dis[0].animal_id).toBe(1)
            expect(animal_dis[0].disposition_id).toBe(2)
        })
    })

    describe('getAnimalByDispositionId(disposition_id)', ()=>{
        it('returns a list of animals that have a diposition based on the disposition_id', async ()=>{
            await insertDispositions();
            const animalList = await getTestAnimals();
            let index = 1
            await asyncForEach(animalList, async (animal) =>{
                await db('animals').insert(animal);
                await db('animal_dispositions').insert({animal_id: index, disposition_id: 1})
                index++;
            })
            await db('animal_dispositions').insert({animal_id: 1, disposition_id: 2})

            let dispositions = await db('dispositions');
            expect(dispositions.length).toBe(3);
            let animals = await db('animals')
            expect(animals.length).toBe(4)
            let animal_dispositions = await db('animal_dispositions')
            expect(animal_dispositions.length).toBe(5);

            let res = await Dispositions.getAnimalByDispositionId(1)
            expect(res.length).toBe(4);

            res = await Dispositions.getAnimalByDispositionId(2)
            expect(res.length).toBe(1);

            res = await Dispositions.getAnimalByDispositionId(3)
            expect(res.length).toBe(0);

        })
    })

    describe('getAnimalDispositions(animal_id)', ()=>{
        it('returns a list of dispositions that an animal has based on animal_id', async ()=>{
            const animalList = await getTestAnimals();
            await insertDispositions();
            let index = 1
            await asyncForEach(animalList, async (animal) =>{
                await db('animals').insert(animal);
                await db('animal_dispositions').insert({animal_id: index, disposition_id: 1})
                index++;
            })
            await db('animal_dispositions').insert({animal_id: 1, disposition_id: 2})

            let dispositions = await db('dispositions');
            expect(dispositions.length).toBe(3);
            let animals = await db('animals')
            expect(animals.length).toBe(4)
            let animal_dispositions = await db('animal_dispositions')
            expect(animal_dispositions.length).toBe(5);

            const res = await Dispositions.getAnimalDispositions(1)
            expect(res.length).toBe(2);

            const disList = await getDispositions();
            res.forEach((obj, i) => {
                expect(obj.disposition).toEqual(disList[i])
            })
            
        })
    })

    describe('getDispositionId(disposition)', ()=>{
        it('returns the id of a particular diposition string', async ()=>{
            await insertDispositions();
            let dispositions = await db('dispositions');
            expect(dispositions.length).toBe(3);

            const id = await Dispositions.getDispositionId('Good with children')
            expect(id).toBe(1);
        })
    })

    describe('deleteDisposition(disposition_id)', ()=>{
        it('deletes a disposition from the database', async()=>{
            await insertDispositions();
            let dispositions = await db('dispositions');
            expect(dispositions.length).toBe(3);

            let count = await Dispositions.deleteDisposition(1);
            expect(count).toBe(1);

            dispositions = await db('dispositions');
            expect(dispositions.length).toBe(2);

            const disList = await getDispositions();
            let deleted = true;
            dispositions.forEach(dispo =>{
                if(dispo.disposition === disList[0]){
                    deleted = false;
                }
            })
            expect(deleted).toBe(true)
        })

        it('returns 0 when trying to delete a disposition id not in the database', async ()=>{
            const count = await Dispositions.deleteDisposition(1);
            expect(count).toBe(0);
        })
    })

    describe('deleteAnimalDispositions(disposition_id, animal_id)', ()=>{
        it('deletes all disposition from an animal object based on animal_id and returns the count of the number of animal objects affected', async ()=>{
            const animalList = await getTestAnimals();
            await insertDispositions();
            let index = 1
            await asyncForEach(animalList, async (animal) =>{
                await db('animals').insert(animal);
                await db('animal_dispositions').insert({animal_id: index, disposition_id: 1})
                index++;
            })
            await db('animal_dispositions').insert({animal_id: 1, disposition_id: 2})

            let dispositions = await db('dispositions');
            expect(dispositions.length).toBe(3);
            let animals = await db('animals')
            expect(animals.length).toBe(4)
            let animal_dispositions = await db('animal_dispositions')
            expect(animal_dispositions.length).toBe(5);

            const count = await Dispositions.deleteAnimalDipositions(1)
            animal_dispositions = await db('animal_dispositions')
            expect(animal_dispositions.length).toBe(3);
            animal_dispositions.forEach(ad => {
                expect(ad.disposition_id).not.toEqual(2)
            })
            dispositions = await db('dispositions');
            expect(dispositions.length).toBe(3);
            animals = await db('animals')
            expect(animals.length).toBe(4)
            expect(count).toBe(2);
        })

        it('returns 0 when trying to remove a disposition not on an animal in the database', async ()=>{
            const count = await Dispositions.deleteAnimalDipositions(5);
            expect(count).toBe(0);
        })
    })
})

module.exports = {
    insertDispositions,
    getDispositions
}