exports.up = function(knex, Promise) {
  return knex.schema.table('users', function(t) {
      t.integer('role').notNullable()
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('users', function(t) {
      t.dropColumn('role');
  });
};
