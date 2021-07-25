exports.seed = function (knex) {
  return knex("availability").insert([
    { availability_id: 1, availability: "Not Available" },
    { availability_id: 2, availability: "Available" },
    { availability_id: 3, availability: "Pending" },
    { availability_id: 4, availability: "Adopted" },
  ]);
};
