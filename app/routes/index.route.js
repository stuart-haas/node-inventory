const express = require('express');
const router = express.Router();
const product_controller = require('../controllers/product.controller');
const Chart = require('../models/chart.model.js');

router.get('/', (req, res) => {
  res.status(301).redirect('/dashboard');
});

router.get('/dashboard', (req, res) => {
  var path = req.path.replace(/\//g, "");

  var executables = [
    {execute: product_controller.product_get_low_stock, type: 'doughnut', label: 'name', data: 'quantity', fields: ['_id', 'name', 'quantity'], 'title': 'Low Stock'},
    {execute: product_controller.product_get_highest_price, type: 'bar', label: 'name', data: 'price', fields: ['_id', 'name', 'price'], 'title': 'Highest Price'},
  ]

  var promises = [];
  
  for(var i = 0; i < executables.length; i ++) {
    var promise = new Promise((resolve, reject) => {
      resolve(executables[i].execute());
    });
    promises.push(promise);
  }

  Promise.all(promises)
  .then((results) => {
    var charts = [];
    var data = [];
    for(var i = 0; i < results.length; i ++) { // loop results
      charts.push(new Chart(results[i], executables[i].type, executables[i].label, executables[i].data).config);
      var products = []; // product group
      for(var j = 0; j < results[i].length; j ++) { // loop products
        var product = results[i][j];
        var fields = executables[i].fields;
        var title = executables[i].title;
        var obj = {};
        for(var k = 0; k < fields.length; k ++) {
          obj[fields[k]] = product[fields[k]];
        }
        products.push(obj);
      }
      data.push({title: title, fields: fields, products: products});
    }

    res.render('index', {
      pageTitle: "Dashboard",
      path: path,
      data: data,
      charts: charts
    });
  })
  .catch((err) => {
    console.log(err);
  });
});

module.exports = router;