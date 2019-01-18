const Product = require('../models/product.model');

exports.product_get = (filter, fields, sort) => {
  return Product.find(filter, fields, sort).exec();
};

exports.product_get_by_id = (id) => {
  return Product.findById(id).exec();
};

exports.product_get_low_stock = () => {
  return Product.find({quantity: { $lt: 10 }}, null, {sort: {quantity: 1}}).exec();
};

exports.product_get_highest_price = () => {
  return Product.find({}, null, {sort: {price: -1}, limit: 5}).exec();
};

exports.product_save = (req, res, next) => {
  let product = new Product({
    name: req.body.name,
    cost: req.body.cost,
    price: req.body.price,
    quantity: req.body.quantity
  });

  product.save((err) => {
    if (err) return next(err);
    res.redirect('/products/?save=true&name=' + req.body.name);
  })
};

exports.product_update = (req, res) => {
  Product.findByIdAndUpdate(req.query.id, {$set: req.body}, (err, product) => {
      if (err) return next(err);
      res.redirect('/products/?update=true&name=' + req.body.name);
  });
};

exports.product_delete = (req, res) => {
  Product.findByIdAndRemove(req.query.id, function (err) {
      if (err) return next(err);
      res.redirect('/products/?delete=true&name=' + req.body.name);
  });
};