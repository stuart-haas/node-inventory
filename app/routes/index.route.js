const express = require('express');
const router = express.Router();
const Product = require('../models/product.model');

router.get('/', (req, res) =>
{

  Product.find({}, function(err, products) {
    var productMap = {};

    products.forEach(function(product) {
      productMap[product._id] = product;
    });

    res.render('index', {
      pageHeader: 'Dashboard',
      products: productMap
    });
  });
});

module.exports = router;