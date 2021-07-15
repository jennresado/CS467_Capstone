exports.seed = function (knex) {
  return knex("animal_type").insert([{ type_id: 1, animal_id: 1 }]);
};
