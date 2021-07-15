exports.seed = function (knex) {
  return knex("animal_dispositions").insert([
    { animal_id: 1, disposition_id: 1 },
    { animal_id: 1, disposition_id: 2 },
  ]);
};
