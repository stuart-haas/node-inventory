const express = require('express');
const router = express.Router();

const product_controller = require('../controllers/product.controller');

router.get('/', (req, res) => {
  res.status(301).redirect('/dashboard');
});

router.get('/dashboard', (req, res) =>
{
  var path = req.url.replace(/\//g, "");

  Promise.all([
    product_controller.product_get_low_stock(req, res),
    product_controller.product_get_highest_price(req, res)
  ])
  .then(function(result) {
    res.render('index', {
      path: path,
      products_low_stock: result[0],
      products_highest_price: result[1]
    });
  });
});

module.exports = router;