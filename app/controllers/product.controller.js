const Product = require('../models/product.model');

exports.product_create = (req, res) => {
  let product = new Product({
    name: req.body.name,
    price: req.body.price
  });

  product.save = (err) => {
    if(err) {
      return next(err);
    }
    res.send('Product created successfully');
  }
};

exports.test = (req, res) => {
  res.send('Greetings from the Test controller!');
};