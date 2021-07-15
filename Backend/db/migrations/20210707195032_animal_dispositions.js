exports.up = function (knex) {
  return knex.schema
    .createTable("dispositions", (tbl) => {
      tbl.increments("disposition_id");
      tbl.string("disposition", 256).notNullable();
    })
    .createTable("animal_dispositions", (tbl) => {
      tbl.increments("animal_dis_id");
      tbl
        .integer("disposition_id")
        .unsigned()
        .references("dispositions.disposition_id")
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
    .dropTableIfExists("animal_dispositions")
    .dropTableIfExists("dispositions");
};
