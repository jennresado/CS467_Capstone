exports.seed = function (knex) {
  return knex("types").insert([
    { type_id: 1, type: "dog" },
    { type_id: 2, type: "cat" },
    { type_id: 3, type: "other" },
  ]);
};
