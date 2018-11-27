var express = require('express');
var router = express.Router();

var product_controller = require('../controllers/product.controller');

router.get('/', (req, res) =>
{
  res.render('products', {
    pageHeader: 'Products',
  });
});

router.post('/create', product_controller.product_create);

module.exports = router;