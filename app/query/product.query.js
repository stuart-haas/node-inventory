const knex = require('../db/knex.db');

exports.get = {
  all: () => {
    return knex.select('products.id', 'products.name', 'products.price', 'products.quantity', 'categories.cat_name')
    .from('products')
    .leftJoin('relations', function() {
      this.on('relations.source_id', '=', 'products.id')
    })
    .leftJoin('categories', function() {
      this.on('categories.id', '=', 'relations.target_id')
    });
  },
  byId: (id) => {
    return knex.select('products.id', 'products.name', 'products.price', 'products.quantity', 'categories.cat_name')
    .from('products')
    .leftJoin('relations', function() {
      this.on('relations.source_id', '=', 'products.id')
    })
    .leftJoin('categories', function() {
      this.on('categories.id', '=', 'relations.target_id')
    })
    .where('products.id', id).first();
  }
};

exports.save = (req) => {
  var product = {
    id: req.body.id,
    name: req.body.name,
    price: req.body.price,
    quantity: req.body.quantity,
    created_at: new Date()
  }
  return knex.insert(product).returning('id').into('products');
};

exports.update = (req) => {
  var product = {
    name: req.body.name,
    price: req.body.price,
    quantity: req.body.quantity,
    updated_at: new Date()
  }
  return knex('products')
  .where('id', req.query.id)
  .update(
    product
  );
};

exports.delete = (id) => {
  return knex('products')
  .where('id', id)
  .delete();
};