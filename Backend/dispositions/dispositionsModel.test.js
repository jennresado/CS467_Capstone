const db = require('../db/dbconfig');
const Dispositions = require('./dispositionsModel');
const constants = require("../animals/testConstants");
const fs = require('fs')
const {getTestAnimals, asyncForEach} = require('../animals/animalsModel.test')

//sample dispositions to be used in tests 
async function getDispositions(){
    const disposition1 = "Good with other animals";
    const disposition2 = "Good with children";
    const disposition3 = "Animal must be leashed at all times";

    return [disposition1, disposition2, disposition3]
}

describe('dispositionsModel', ()=>{
    //wipes all tables in database clean so each test starts with empty tables
  beforeEach(async () => {
    //db is the knex initialized object using db.raw to truncate postgres tables with foreign keys
    //can use knex.raw but it is global and deprecated
    await db.raw("TRUNCATE TABLE animals RESTART IDENTITY CASCADE");
    await db.raw("TRUNCATE TABLE users RESTART IDENTITY CASCADE");
    await db.raw("TRUNCATE TABLE user_animals RESTART IDENTITY CASCADE");
    await db.raw("TRUNCATE TABLE animal_dispositions RESTART IDENTITY CASCADE");
    await db.raw("TRUNCATE TABLE breeds RESTART IDENTITY CASCADE");
    await db.raw("TRUNCATE TABLE animal_breeds RESTART IDENTITY CASCADE");

    
  });

    describe('addDisposition(disposition)', ()=>{
        it('adds a disposition to the database', async () => {
            let disList = await getDispositions();

            await Dispositions.addDisposition(disList[0])

            let dispositions = await db('dispositions')

            expect(dispositions.length).toBe(1);
            expect(dispositions[0]).toEqual({disposition_id: 1, disposition: disList[0]})

            await Dispositions.addDisposition(disList[1])

            dispositions = await db('dispositions')

            expect(dispositions.length).toBe(2);
            expect(dispositions[1]).toEqual({disposition_id: 2, disposition: disList[1]})
        })
    })

    describe('addAnimalDisposition(animal_id, disposition_id)', ()=>{
        it('relates a disposition to an animal object', async()=>{
            const disList = await getDispositions();
            const animalList = await getTestAnimals();
            await db('dispositions').insert({disposition: disList[0]});
            await db('animals').insert(animalList[0]);

            const dispositions = await db('dispositions');
            const animals = await db('animals');
            expect(dispositions.length).toBe(1);
            expect(animals.length).toBe(1);

            const id = await Dispositions.addAnimalDisposition(1, 1);
            const animal_dis = await db('animal_dispositions');
            expect(animal_dis.length).toBe(1);
            expect(id[0]).toBe(1);
        })
    })

    describe('editDisposition(disposition_id, disposition)', () => {
        it('edits a disposition by the disposition_id', async ()=>{
            const disList = await getDispositions();
            await asyncForEach(disList, async (dispo) =>{
                await db('dispositions').insert({disposition: dispo});
            })
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

    describe('getAnimalByDisposition(disposition_id)', ()=>{
        it('returns a list of animals that have a diposition based on the disposition_id', async ()=>{
            const disList = await getDispositions();
            const animalList = await getTestAnimals();
            await asyncForEach(disList, async (dispo) =>{
                await db('dispositions').insert({disposition: dispo});
            })
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

    describe.only('getAnimalDispositions(animal_id)', ()=>{
        it('returns a list of dispositions that an animal has based on animal_id', async ()=>{
            const disList = await getDispositions();
            const animalList = await getTestAnimals();
            await asyncForEach(disList, async (dispo) =>{
                await db('dispositions').insert({disposition: dispo});
            })
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

            res.forEach((obj, i) => {
                expect(obj.disposition).toEqual(disList[i])
            })
            

        })
    })

    describe('getAnimalDispositions(animal_id)', ()=>{
        it('returns a list of dispositions that an animal has based on animal_id', async ()=>{
            const disList = await getDispositions();
            const animalList = await getTestAnimals();
            await asyncForEach(disList, async (dispo) =>{
                await db('dispositions').insert({disposition: dispo});
            })
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

            res.forEach((obj, i) => {
                expect(obj.disposition).toEqual(disList[i])
            })
            

        })
    })

    describe('getDispositionId(disposition)', ()=>{
        it('returns the id of a particular diposition string', async ()=>{
            const disList = await getDispositions();
            await asyncForEach(disList, async (dispo) =>{
                await db('dispositions').insert({disposition: dispo});
            })
            let dispositions = await db('dispositions');
            expect(dispositions.length).toBe(3);

            const id = await Dispositions.getDispositionId(disList[0])
            expect(id.length).toBe(1);
            expect(id).toEqual([{'disposition_id': 1}]);
        })
    })

    describe('deleteDisposition(disposition_id)', ()=>{
        it('deletes a disposition from the database', async()=>{
            const disList = await getDispositions();
            await asyncForEach(disList, async (dispo) =>{
                await db('dispositions').insert({disposition: dispo});
            })
            let dispositions = await db('dispositions');
            expect(dispositions.length).toBe(3);

            let count = await Dispositions.deleteDisposition(1);
            expect(count).toBe(1);

            dispositions = await db('dispositions');
            expect(dispositions.length).toBe(2);

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

    describe('deleteAnimalDisposition(disposition_id, animal_id)', ()=>{
        it('deletes a disposition from an animal object and returns the count of the number of animal objects affected', async ()=>{
            const disList = await getDispositions();
            const animalList = await getTestAnimals();
            await asyncForEach(disList, async (dispo) =>{
                await db('dispositions').insert({disposition: dispo});
            })
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

            const count = await Dispositions.deleteAnimalDiposition(2, 1)
            animal_dispositions = await db('animal_dispositions')
            expect(animal_dispositions.length).toBe(4);
            animal_dispositions.forEach(ad => {
                expect(ad.disposition_id).not.toEqual(2)
            })
            dispositions = await db('dispositions');
            expect(dispositions.length).toBe(3);
            animals = await db('animals')
            expect(animals.length).toBe(4)
            expect(count).toBe(1);
        })

        it('returns 0 when trying to remove a disposition not on an animal', async ()=>{
            const count = await Dispositions.deleteAnimalDiposition(1);
            expect(count).toBe(0);
        })
    })
})