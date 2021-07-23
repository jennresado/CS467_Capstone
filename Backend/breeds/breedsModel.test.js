const db = require('../db/dbconfig');
const Breeds = require('./breedsModel');
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

//sample breeds to be used in tests
// length of list is 48
async function getBreeds(){
    return ["australian shepherd", 
    "beagle", 
    "border collie", 
    "boston terrier", 
    "boxer", 
    "bulldog", 
    "cavalier king charles spaniel", 
    "chihuahua", 
    "dachshund", 
    "dalmatian", 
    "dobermann", 
    "french bulldog", 
    "german shepherd", 
    "golden retriever", 
    "great dane", 
    "labrador retriever", 
    "miniature schnauzer", 
    "mixed breed",
    "pembroke welsh corgi", 
    "pomeranian", 
    "poodle", 
    "pug", 
    "rottweiler", 
    "shiba inu", 
    "shih tzu", 
    "siberian husky", 
    "yorkshire terrier", "abyssinian", 
    "american shorthair", 
    "balinese cat", 
    "bengal cat", 
    "british longhair", 
    "british shorthair", 
    "chartreux", 
    "himalayan cat", 
    "himalayan cat", 
    "maine coon", 
    "mixed breed",
    "munchkin cat", 
    "persian cat", 
    "ragdoll", 
    "russian blue", 
    "scottish fold", 
    "siamese cat", 
    "snowshoe cat", 
    "sphynx cat", 
    "turkish angora",
    'other']
}

//insert the animals needed
async function insertAnimals(){
    const animals = await getTestAnimals();
    await asyncForEach(animals, async (animal) =>{
        await db('animals').insert(animal)
    })

}

//insert the breeds needed 
async function insertBreeds(){
    const breeds = await getBreeds();
    await asyncForEach(breeds, async (breed) =>{
        await db('breeds').insert({breed})
    })
}

// add the relation between animal and breed
async function insertAnimalBreed(animal_id, breed_id){
    await db('animal_breeds').insert({animal_id, breed_id}, 'animal_breeds_id')
}

describe('breedsModel', ()=>{
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

    describe('addBreed(breed)', ()=>{
        it('adds a breed to the database', async ()=>{
            let breeds = await db('breeds');
            expect(breeds.length).toBe(0);

            const breed_id = await Breeds.addBreed('collie')
            expect(breed_id).toEqual([1])

            breeds = await db('breeds');
            expect(breeds.length).toBe(1);
        })
    })

    describe('addAnimalBreed(animal_id, breed_id)', ()=>{
        it('relates a breed to an animal object', async ()=>{
            await insertAnimals();
            const animals = await db("animals")
            expect(animals.length).toBe(4)

            await db('breeds').insert({breed: 'collie'})
            const breeds = await db('breeds')
            expect(breeds.length).toBe(1);

            const animal_breed = await Breeds.addAnimalBreed(1, 1)
            expect(animal_breed).toEqual([1])

            const animal_breeds = await db('animal_breeds')
            expect(animal_breeds.length).toBe(1);
            expect(animal_breeds[0].animal_id).toBe(1)
            expect(animal_breeds[0].breed_id).toBe(1)

        })
    })

    describe('editBreed(breed_id, breed)', ()=>{
        it.only('edits a breed by the breed_id', async()=>{
            await insertBreeds();
            let breeds = await db('breeds')
            expect(breeds.length).toBe(48)
            expect(breeds[0].breed).toEqual('australian shepherd')

            const edit_count = await Breeds.editBreed(1, 'aussie')
            expect(edit_count).toBe(1);

            breeds = await db('breeds')
            expect(breeds.length).toBe(48)

            breeds = await db('breeds').where({breed_id: 1})
            expect(breeds[0].breed).toEqual('aussie')
        })

        it('sends a count of 0 when trying to edit a breed with a bad breed_id', async ()=>{
            const edit_count = await Breeds.editBreed(1, {breed: 'nothing'})
            expect(edit_count).toBe(0);
        })
    })    

    describe('editAnimalBreed(editObj)', ()=>{
        it('changes the breed of a particular animal', async ()=>{
            await insertAnimals();
            const animals = await db("animals")
            expect(animals.length).toBe(4)

            await insertBreeds()
            const breeds = await db('breeds')
            expect(breeds.length).toBe(48);

            await insertAnimalBreed(1, 1);
            let animal_breed = await db('animal_breeds')
            expect(animal_breed.length).toBe(1)

            const editObj = {
                animal_id: 1, 
                breed_id: 1, 
                breed: 'maine coon'
            }

            const edit_id = await Breeds.editAnimalBreed(editObj);
            expect(edit_id[0]).toBe(2)

            animal_breed = await db('animal_breeds')
            expect(animal_breed.length).toBe(1)
            expect(animal_breed[0].animal_id).toBe(1)
            expect(animal_breed[0].breed_id).toBe(37)
        })
    })

    describe('getAnimalBreeds(animal_id)', ()=>{
        it('returns a list of breeds based on animal_id', async ()=>{
            await insertAnimals();
            const animals = await db("animals")
            expect(animals.length).toBe(4)

            await insertBreeds()
            const breeds = await db('breeds')
            expect(breeds.length).toBe(48);

            await insertAnimalBreed(1, 1);
            await insertAnimalBreed(1, 2);
            await insertAnimalBreed(1, 3);
            let animal_breed = await db('animal_breeds')
            expect(animal_breed.length).toBe(3)

            const animal_breeds = await Breeds.getAnimalBreeds(1);
            expect(animal_breeds.length).toBe(3);
            
            const breed_list = await getBreeds();
            for(let i = 0; i < 3; i++){
                expect(animal_breeds[i].breed).toEqual(breed_list[i])
                expect(animal_breeds[i].animal_id).toBe(1)
                expect(animal_breeds[i].breed_id).toBe(i+1)
            }
        })
    })

    describe('getAnimalByBreedId(breed_id)', ()=>{
        it('returns a list of animals that have a breed based on the breed_id',async ()=>{
            await insertAnimals();
            await insertBreeds();
            await insertAnimalBreed(1, 1)
            await insertAnimalBreed(2, 1)
            await insertAnimalBreed(3, 1)
            await insertAnimalBreed(4, 2)

            const animals = await db("animals")
            expect(animals.length).toBe(4)
            const breeds = await db('breeds')
            expect(breeds.length).toBe(48);
            const animal_breed = await db('animal_breeds')
            expect(animal_breed.length).toBe(4)

            let arr = await Breeds.getAnimalByBreedId(1)
            expect(arr.length).toBe(3)
            await asyncForEach(arr, async (obj, i)=>{
                expect(obj.animal_id).toBe(i+1)
            })

            arr = await Breeds.getAnimalByBreedId(2)
            expect(arr.length).toBe(1)
            expect(arr[0].animal_id).toBe(4);
        })
    })

    describe('getBreedId(breed)', ()=>{
        it('returns the id of a particular breed string', async ()=>{
            await insertBreeds();
            const breeds = await db('breeds')
            expect(breeds.length).toBe(48);

            const breed_list = await getBreeds();

            let breed_id = await Breeds.getBreedId(breed_list[0])
            expect(breed_id).toBe(1)

            breed_id = await Breeds.getBreedId(breed_list[46])
            expect(breed_id).toBe(47)
        })
    })

    describe('deleteBreed(breed_id)', ()=>{
        it('deletes a breed from the database', async()=>{
            await insertBreeds();
            let breeds = await db('breeds')
            expect(breeds.length).toBe(48);

            let count = await Breeds.deleteBreed(1)
            expect(count).toBe(1);

            breeds = await db('breeds')
            expect(breeds.length).toBe(47);

            const breed_list = await getBreeds()

            let deleted = true;
            breeds.forEach(breed => {
                if(breed.breed === breed_list[0]){
                    deleted = false
                }
            })
            expect(deleted).toBe(true);
        })

        it('returns 0 when trying to delete a breed id not in the database', async ()=>{
            const count = await Breeds.deleteBreed(1);
            expect(count).toBe(0);
        })
    })

    describe('deleteAnimalBreeds(animal_id)', ()=>{
        it('deletes all breeds from an animal object and returns the count of the number of animal objects affected', async ()=>{
            await insertAnimals();
            const animals = await db("animals")
            expect(animals.length).toBe(4)

            await insertBreeds()
            const breeds = await db('breeds')
            expect(breeds.length).toBe(48);

            await insertAnimalBreed(1, 1);
            await insertAnimalBreed(1, 2);
            await insertAnimalBreed(1, 3);
            await insertAnimalBreed(2, 3);
            let animal_breed = await db('animal_breeds')
            expect(animal_breed.length).toBe(4)

            const count = await Breeds.deleteAnimalBreeds(1);
            expect(count).toBe(3)

            animal_breed = await db('animal_breeds')
            expect(animal_breed.length).toBe(1)
            expect(animal_breed[0].animal_id).toBe(2)
            expect(animal_breed[0].breed_id).toBe(3)
        })

        it('returns 0 when trying to remove a breed not on an animal in the database', async ()=>{
            const count = await Breeds.deleteAnimalBreeds(1);
            expect(count).toBe(0)
        })
    })
})