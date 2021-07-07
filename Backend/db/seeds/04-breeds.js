exports.seed = function (knex) {
  return knex("breeds").insert([{ breed_id: 1, breed: "Collie" }]);
};
