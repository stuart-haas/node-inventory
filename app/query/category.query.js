const knex = require('../db/knex.db');

exports.get = {
  all: () => {
    return knex.select('*').from('categories');
  },
  byId: (id) => {
    return knex('categories').where('id', id);
  }
};

exports.save = (req) => {
  req.body.dateCreated = new Date();
  return knex('categories').insert(req.body);
};

exports.update = (req) => {
  req.body.dateUpdated = new Date();
  return knex('categories')
  .where('id', req.query.id)
  .update(
    req.body
  );
};

exports.delete = (id) => {
  return knex('categories')
  .where('id', id)
  .delete();
};