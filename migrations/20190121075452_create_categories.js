
exports.up = function(knex, Promise) {
  return knex.schema.createTable('categories', (t) => {
    t.increments('id').primary();
    t.text('cat_name').notNullable();
    t.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('categories');
};
