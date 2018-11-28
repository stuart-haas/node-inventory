const express = require('express');
const router = express.Router();

const product_controller = require('../controllers/product.controller');

router.get('/', (req, res) => {
  res.status(301).redirect('/dashboard');
});

router.get('/dashboard', (req, res) =>
{
  var path = req.path.replace(/\//g, "");

  Promise.all([
    product_controller.product_get_low_stock(req, res),
    product_controller.product_get_highest_price(req, res)
  ])
  .then((result) => {
    res.render('index', {
      pageTitle: "Dashboard",
      path: path,
      products_low_stock: result[0],
      products_highest_price: result[1]
    });
  });
});

module.exports = router;