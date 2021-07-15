
exports.seed = function(knex){
  return knex('user_animals').insert([
    {
      user_animal_id: 1,
      user_id: 1,
      animal_id: 1
    }
  ])
}
