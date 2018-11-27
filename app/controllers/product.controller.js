const Product = require('../models/product.model');

exports.product_create = (req, res, next) => {
  let product = new Product({
    name: req.body.name,
    price: req.body.price
  });

  product.save((err) => {
    if (err) {
      return next(err);
    }
    res.send('Product Created successfully')
  })
};