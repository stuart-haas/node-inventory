exports.up = function(knex, Promise) {
  knex.schema.hasTable('users').then((exists) => {
    if (!exists) {
      return knex.schema.createTable('users', (t) => {
        t.increments('id').primary();
        t.string('username').notNullable();
        t.unique('username');
        t.specificType('password', 'CHAR(255) DEFAULT NULL');
        t.timestamps(true, true);
      });
    }
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
