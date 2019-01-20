const knex = require('../db/knex.db');

exports.get = {
  all: () => {
    return knex.select('*').from('categories');
  },
  byId: (id) => {
    return knex('categories').where('id', id).first();
  }
};

exports.save = (req) => {
  req.body.created_at = new Date();
  return knex('categories').insert(req.body);
};

exports.update = (req) => {
  req.body.updated_at = new Date();
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