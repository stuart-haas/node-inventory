const express = require('express');
const router = express.Router();

const product_controller = require('../controllers/product.controller');

router.get('/products', product_controller.product_get_all);

router.get('/products/new', product_controller.product_new);

router.post('/products/create', product_controller.product_create);

router.get('/products/:id', product_controller.product_get);

router.post('/products/:id/update', product_controller.product_update);

router.post('/products/:id/delete', product_controller.product_delete);

module.exports = router;