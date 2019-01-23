exports.up = function(knex, Promise) {
  return knex.schema.table('users', function(t) {
      t.string('firstName');
      t.string('lastName');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('users', function(t) {
      t.dropColumn('firstName');
      t.dropColumn('lastName');
  });
};