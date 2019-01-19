const knex = require('../db/knex.db');

exports.build = () => {
  knex.schema.hasTable('categories').then((exists) => {
    if (!exists) {
      return knex.schema.createTable('categories', (t) => {
        t.increments('id').primary();
        t.text('cat_name').notNullable();
        t.timestamps(true, true);
      });
    }
  })
};