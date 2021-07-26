const db = require('../db/dbconfig');
const Types = require('./typesModel')
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

//sample types to be used in tests
async function getTypes(){
    return ['dog', 'cat', 'other']
}

//insert the animals needed
async function insertAnimals(){
    const animals = await getTestAnimals();
    await asyncForEach(animals, async (animal) =>{
        await db('animals').insert(animal)
    })

}

//insert the types needed
async function insertTypes(){
    const types = await getTypes();
    await asyncForEach(types, async(type) =>{
        await db('types').insert({type})
    })
} 

//add relation between animal and type
async function insertAnimalType(animal_id, type_id){
    await db('animal_type').insert({animal_id, type_id}, 'animal_type_id');
}

describe('typesModel', ()=>{
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
        await db.raw("TRUNCATE TABLE animal_availability RESTART IDENTITY CASCADE");
        await db.raw("TRUNCATE TABLE availability RESTART IDENTITY CASCADE");
        await db.raw("TRUNCATE TABLE animal_type RESTART IDENTITY CASCADE");
        await db.raw("TRUNCATE TABLE types RESTART IDENTITY CASCADE");
    });

    describe('addType(type)', ()=>{
        it('adds a type to the database', async ()=>{
            let types = await db('types');
            expect(types.length).toBe(0);

            const type_id = await Types.addType('dog');
            expect(type_id).toEqual([1]);

            types = await db('types');
            expect(types.length).toBe(1);
        })
    })

    describe('addAnimalType(animal_id, type_id)', ()=>{
        it('relates a type to an animal object', async ()=>{
            await insertAnimals();
            const animals = await db("animals")
            expect(animals.length).toBe(4)

            await insertTypes();
            const types = await db('types');
            expect(types.length).toBe(3);

            let animal_type = await Types.addAnimalType(1, 1);
            expect(animal_type).toEqual([1]);

            let animal_types = await db('animal_type');
            expect(animal_types.length).toBe(1);
            expect(animal_types[0].animal_id).toBe(1);
            expect(animal_types[0].type_id).toBe(1);

            animal_type = await Types.addAnimalType(2, 3);
            expect(animal_type).toEqual([2]);

            animal_types = await db('animal_type');
            expect(animal_types.length).toBe(2);
            expect(animal_types[1].animal_id).toBe(2);
            expect(animal_types[1].type_id).toBe(3);
        })
    })

    describe('editType(type_id, type)', ()=>{
        it('edits a type by the type_id', async ()=> {
            await insertTypes();
            let types = await db('types');
            expect(types.length).toBe(3);

            const edit_count = await Types.editType(1, 'herding dog');
            expect(edit_count).toBe(1);

            types = await db('types');
            expect(types.length).toBe(3);
            
            types = await db('types').where({type_id: 1}).first();
            expect(types.type).toEqual('herding dog');
        })

        it('sends a count of 0 when trying to edit a type with a bad type_id', async ()=> {
            const edit_count = await Types.editType(1, {type: 'nothing'});
            expect(edit_count).toBe(0);
        })
    })

    describe('editAnimalType(editObj)', ()=>{
        it('changes the type of a particular animal', async ()=>{
            await insertAnimals();
            const animals = await db("animals")
            expect(animals.length).toBe(4)

            await insertTypes();
            const types = await db('types');
            expect(types.length).toBe(3);

            await insertAnimalType(1, 2);
            let animal_types = await db('animal_type');
            expect(animal_types.length).toBe(1);
            expect(animal_types[0].animal_id).toBe(1);
            expect(animal_types[0].type_id).toBe(2)

            const editObj = {
                animal_id: 1, 
                type_id: 2,
                type: 'dog'
            }

            const edit_id = await Types.editAnimalType(editObj)
            expect(edit_id[0]).toBe(2)
            
            animal_types = await db('animal_type');
            expect(animal_types.length).toBe(1);
            expect(animal_types[0].animal_id).toBe(1);
            expect(animal_types[0].type_id).toBe(1)
        })
    })

    describe('getAnimalType(animal_id)', ()=>{
        it('returns the type of a particular animal based on the animal_id', async ()=>{
            await insertAnimals();
            const animals = await db("animals")
            expect(animals.length).toBe(4)

            await insertTypes();
            const types = await db('types');
            expect(types.length).toBe(3);

            await insertAnimalType(1, 1);
            await insertAnimalType(2, 2);
            await insertAnimalType(3, 3);
            await insertAnimalType(4, 1);
            let animal_types = await db('animal_type');
            expect(animal_types.length).toBe(4);
            expect(animal_types[0].animal_id).toBe(1);
            expect(animal_types[0].type_id).toBe(1)

            const animal_type = await Types.getAnimalType(1);
            expect(animal_type.type).toEqual('dog');
        })
    })

    describe('getAnimalByTypeId(type_id)', ()=>{
        it('returns a list of animals that have a type based on the type_id', async ()=>{
            await insertAnimals();
            const animals = await db("animals")
            expect(animals.length).toBe(4)

            await insertTypes();
            const types = await db('types');
            expect(types.length).toBe(3);

            await insertAnimalType(1, 1);
            await insertAnimalType(2, 2);
            await insertAnimalType(3, 3);
            await insertAnimalType(4, 1);
            let animal_types = await db('animal_type');
            expect(animal_types.length).toBe(4);

            let animal_type_list = await Types.getAnimalByTypeId(1);
            expect(animal_type_list.length).toBe(2);
            expect(animal_type_list[0].animal_id).toBe(1)
            expect(animal_type_list[1].animal_id).toBe(4)
        })
    })

    describe('getTypeId(type)', ()=>{
        it('returns the id of a particular type string', async()=>{
            await insertTypes();
            const types = await db('types');
            expect(types.length).toBe(3);

            let type_id = await Types.getTypeId('dog')
            expect(type_id).toBe(1);

            type_id = await Types.getTypeId('cat')
            expect(type_id).toBe(2);

            type_id = await Types.getTypeId('other')
            expect(type_id).toBe(3);
        })
    })

    describe('deleteType(type_id)', ()=>{
        it('deletes a type from the database', async ()=>{
            await insertTypes();
            let types = await db('types');
            expect(types.length).toBe(3);

            const count = await Types.deleteType(1);
            expect(count).toBe(1)

            types = await db('types');
            expect(types.length).toBe(2);

            types = await db('types').where({type_id:1});
            expect(types.length).toBe(0);
        })

        it('returns 0 when trying to delete a type id not in the database', async ()=>{
            const count = await Types.deleteType(1);
            expect(count).toBe(0)
        })
    })

    describe('deleteAnimalType(animal_id)', ()=>{
        it('deletes type from animal object and returns the count of the number of animal objects affected', async ()=> {
            await insertAnimals();
            const animals = await db("animals")
            expect(animals.length).toBe(4)

            await insertTypes();
            const types = await db('types');
            expect(types.length).toBe(3);

            await insertAnimalType(1, 1);
            await insertAnimalType(2, 2);
            await insertAnimalType(3, 3);
            await insertAnimalType(4, 1);
            let animal_types = await db('animal_type');
            expect(animal_types.length).toBe(4);

            const count = await Types.deleteAnimalType(1);
            expect(count).toBe(1)

            animal_types = await db('animal_type');
            expect(animal_types.length).toBe(3);

            animal_types = await db('animal_type').where({animal_id: 1});
            expect(animal_types.length).toBe(0);
        })

        it('returns 0 when trying to remove a type not on an animal in the database', async ()=>{
            const count = await Types.deleteAnimalType(1);
            expect(count).toBe(0)
        })
    })
})