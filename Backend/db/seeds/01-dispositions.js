exports.seed = function (knex) {
  return knex("dispositions").insert([
    {
      disposition_id: 1,
      disposition: "Good with children",
    },
    {
      disposition_id: 2,
      disposition: "Good with other animals",
    },
    {
      disposition_id: 3,
      disposition: "Animal must be leashed at all times",
    },
  ]);
};
