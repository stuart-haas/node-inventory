const express = require('express');
const router = express.Router();

const product_controller = require('../controllers/product.controller');

router.get('/products/new', (req, res) => {
  
  res.render('products/new', {
    pageTitle: "New Product"
  });
});

router.get('/products', (req, res) => {
  var status = req.query.status;
  var query = req.query;
  var path = req.path.replace(/\//g, "");

  return new Promise(resolve => {
    resolve(product_controller.product_get_all(req, res));
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
  });  
});

router.get('/products/:id', (req, res) => {

  return new Promise(resolve => {
    resolve(product_controller.product_get(req, res));
  })
  .catch((error) => {
    reject(error);
  })
  .then((result) => {
    res.render('products/modify', {
      pageTitle: "Modify Product",
      product: result
    });
  });
});;

router.post('/products/create', product_controller.product_create);

router.post('/products/:id/update', product_controller.product_update);

router.post('/products/:id/delete', product_controller.product_delete);

module.exports = router;