exports.seed = function (knex) {
  return knex("animal_availability").insert([
    { availability_id: 2, animal_id: 1 },
  ]);
};
