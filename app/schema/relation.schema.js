const knex = require('../db/knex.db');

exports.build = () => {
  knex.schema.hasTable('relations').then((exists) => {
    if (!exists) {
      return knex.schema.createTable('relations', (t) => {
        t.increments('id').primary();
        t.integer('source_id').notNullable();
        t.integer('target_id').notNullable();
        t.timestamps(true, true);
      });
    }
  })
};