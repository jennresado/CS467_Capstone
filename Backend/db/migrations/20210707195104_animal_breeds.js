exports.up = function (knex) {
  return knex.schema
    .createTable("breeds", (tbl) => {
      tbl.increments("breed_id");
      tbl.string("breed", 256).notNullable();
    })
    .createTable("animal_breeds", (tbl) => {
      tbl.increments("animal_breeds_id");
      tbl
        .integer("animal_id")
        .unsigned()
        .references("animals.animal_id")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      tbl
        .integer("breed_id")
        .unsigned()
        .references("breeds.breed_id")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("animal_breeds")
    .dropTableIfExists("breeds");
};
