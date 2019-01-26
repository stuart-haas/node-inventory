exports.up = function(knex, Promise) {
  knex.schema.hasTable('assets').then((exists) => {
    if (!exists) {
      return knex.schema.createTable('assets', (t) => {
        t.increments('id').primary();
        t.specificType('path', 'VARCHAR(100) DEFAULT NULL');
        t.timestamps(true, true);
      });
    }
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('assets');
};
