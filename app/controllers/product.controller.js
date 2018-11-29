const Product = require('../models/product.model');

exports.product_get_all = (req, res) => {
  return Product.find({}, null, {}).exec();
};

exports.product_get_low_stock = (req, res) => {
  return Product.find({quantity: { $lt: 10 }}, null, {sort: {quantity: 1}}).exec();
};

exports.product_get_highest_price = (req, res) => {
  return Product.find({}, null, {sort: {price: -1}, limit: 5}).exec();
};

exports.product_get = (req, res) => {
  return Product.findById(req.params.id).exec();
};

exports.product_create = (req, res, next) => {
  let product = new Product({
    name: req.body.name,
    price: req.body.price,
    quanity: req.body.quanity
  });

  product.save((err) => {
    if (err) return next(err);
    res.redirect('/products/?status=created&name=' + req.body.name);
  })
};

exports.product_update = (req, res) => {
  Product.findByIdAndUpdate(req.params.id, {$set: req.body}, (err, product) => {
      if (err) return next(err);
      res.redirect('/products/?status=updated&id=' + req.params.id);
  });
};

exports.product_delete = (req, res) => {
  Product.findByIdAndRemove(req.params.id, function (err) {
      if (err) return next(err);
      res.redirect('/products/?status=deleted&id=' + req.params.id);
  });
};