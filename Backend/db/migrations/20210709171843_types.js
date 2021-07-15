exports.up = function (knex) {
  return knex.schema
    .createTable("types", (tbl) => {
      tbl.increments("type_id");
      tbl.string("type");
    })
    .createTable("animal_type", (tbl) => {
      tbl.increments("animal_type_id");
      tbl
        .integer("type_id")
        .unsigned()
        .references("types.type_id")
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
    .dropTableIfExists("anaimal_type")
    .dropTableIfExists("types");
};
