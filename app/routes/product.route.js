const express = require('express');
const router = express.Router();

const product_controller = require('../controllers/product.controller');

router.get('/products', (req, res) => {
  var path = req.path.replace(/\//g, "");
  var query = req.query;

  return new Promise(resolve => {
    resolve(product_controller.product_get({}, null, {sort: {name: 1}}));
  })
  .catch((error) => {
    reject(error);
  })
  .then((result) => {
    res.render('products', {
      pageTitle: "Products",
      path: path,
      query: query,
      products: result,
    });
  })
  .catch((err) => {
    console.log(err);
  });
});

router.get('/products/create', (req, res) => {

  res.render('products/create', {
    pageTitle: "Create Product"
  });
});

router.get('/products/modify', (req, res) => {
  return new Promise(resolve => {
    resolve(product_controller.product_get_by_id(req.query.id));
  })
  .catch((error) => {
    reject(error);
  })
  .then((result) => {
    res.render('products/modify', {
      pageTitle: "Modify Product",
      product: result
    });
  })
  .catch((err) => {
    console.log(err);
  });
});;

router.post('/products/save', product_controller.product_save);

router.post('/products/update', product_controller.product_update);

router.post('/products/delete', product_controller.product_delete);

module.exports = router;