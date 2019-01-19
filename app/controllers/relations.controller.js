const knex = require('../models/knex.model');

exports.get = {
  bySourceId: (source_id) => {
    return knex('relations').where('source_id', source_id);
  }
};

exports.save = (source_id, target_id) => {
  return knex('relations').insert({source_id: source_id, target_id: target_id});
};

exports.update = (source_id, target_id) => {
  return knex('relations').where('source_id', source_id).update({source_id: source_id, target_id: target_id});
};

exports.delete = {
  bySourceId: (source_id) => { 
    return knex('relations').where('source_id', source_id).delete()
  },
  byTargetId: (target_id) => { 
    return knex('relations').where('target_id', target_id).delete()
  }
};