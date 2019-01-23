const knex = require('../db/knex.db');

exports.get = {
  all: () => {
    return knex.select('*').from('users');
  },
  byId: (id) => {
    return knex('users').where('id', id).first();
  },
  byUserName: (username) => {
    return knex('users').where('username', username).first();
  }
};

exports.save = (username, hash) => {
  var user = {
    username: username,
    password: hash,
    created_at: new Date()
  }
  return knex('users').insert(user);
};

exports.update = (userId, req) => {
  var user = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    photo: req.file.relativePath,
    updated_at: new Date()
  }
  return knex('users')
  .where('id', userId)
  .update(
    user
  );
};