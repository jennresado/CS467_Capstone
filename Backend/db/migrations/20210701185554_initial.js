
exports.up = function (knex) {
    return knex.schema.createTable('users', tbl => {
        tbl.increments('user_id');
        tbl.string('username', 256).notNullable().unique();
        tbl.string('password', 256).notNullable();
        tbl.string('first_name', 256).notNullable();
        tbl.string('last_name', 256).notNullable();
        tbl.string('email', 256).notNullable();
        tbl.boolean('admin').notNullable().defaultTo(false)
    }).createTable('animals', tbl => {
        tbl.increments('animal_id');
        tbl.string('type', 256).notNullable();
        tbl.string('breed', 256).notNullable();
        tbl.string('disposition', 256).notNullable();
        tbl.string('availability', 256).notNullable();
        tbl.date('date_created').notNullable();
        tbl.text('desciprtion').notNullable();
        tbl.text('news_item').notNullable();
        tbl.binary('pic').notNullable();
    }).createTable('userAnimals', tbl => {
        tbl.increments('user_animal_id');
        tbl.integer('user_id').unsigned().references('users.user_id').onDelete("CASCADE").onUpdate('CASCADE');
        tbl.integer('animal_id').unsigned().references('animals.animal_id').onDelete('CASCADE').onUpdate('CASCADE');
    })
};

exports.down = function (knex) {
    return knex.schema.dropTableIfExists("userAnimals").dropTableIfExists('animals').dropTableIfExists('users');
};
