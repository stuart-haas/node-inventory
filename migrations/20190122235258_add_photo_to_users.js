exports.up = function(knex, Promise) {
  return knex.schema.table('users', function(t) {
    t.specificType('photo', 'VARCHAR(100) DEFAULT NULL');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('users', function(t) {
    t.dropColumn('photo');
  });
};