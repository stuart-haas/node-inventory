const knex = require('../db/knex.db');

exports.get = {
  all: () => {
    return knex.select('*').from('users');
  },
  byId: (id) => {
    return knex('users').where('id', id);
  },
  byUserName: (username) => {
    return knex('users').where('username', username);
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