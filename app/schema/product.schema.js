const knex = require('../db/knex.db');

exports.build = () => {
  knex.schema.hasTable('products').then(function(exists) {
    if (!exists) {
      return knex.schema.createTable('products', function(t) {
        t.increments('id').primary();
        t.text('name').notNullable();
        t.float('price');
        t.integer('quantity');
        t.timestamps(true, true);
      });
    }
  })
};