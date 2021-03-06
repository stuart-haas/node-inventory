exports.up = function(knex, Promise) {
  knex.schema.hasTable('products').then((exists) => {
    if (!exists) {
      return knex.schema.createTable('products', (t) => {
        t.increments('id').primary();
        t.text('name').notNullable();
        t.float('price');
        t.integer('quantity');
        t.timestamps(true, true);
      });
    }
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('products');
};
