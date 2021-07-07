exports.seed = function (knex) {
  return knex("animal_breeds").insert([{ animal_id: 1, breed_id: 1 }]);
};
