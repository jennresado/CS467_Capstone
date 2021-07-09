exports.up = function (knex) {
  return knex.schema
    .createTable("availability", (tbl) => {
      tbl.increments("availability_id");
      tbl.string("availability");
    })
    .createTable("animal_availability", (tbl) => {
      tbl.increments("animal_availability_id");
      tbl
        .integer("availability_id")
        .unsigned()
        .references("availability.availability_id")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      tbl
        .integer("animal_id")
        .unsigned()
        .references("animals.animal_id")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("anaimal_availability")
    .dropTableIfExists("availability");
};
