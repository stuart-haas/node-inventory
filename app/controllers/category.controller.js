const knex = require('../models/knex.model');

exports.get = {
  all: () => {
    return knex.select('*').from('categories');
  },
  byId: (id) => {
    return knex('categories').where('id', id);
  }
};

exports.save = (req) => {
  return knex('categories').insert(req.body);
};

exports.update = (req) => {
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