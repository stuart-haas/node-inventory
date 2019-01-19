const express = require('express');
const router = express.Router();

const product_controller = require('../controllers/product.controller');
const category_controller = require('../controllers/category.controller');
const relations_controller = require('../controllers/relations.controller');

router.get('/product', (req, res) => {
  var path = req.path.replace(/\//g, "");
  var query = req.query;

  product_controller.get.all()
  .then((results) => {
    res.render('product', {
      pageTitle: "Products",
      path: path,
      query: query,
      products: results,
    });
  })
  .catch((error) => {
    console.error(error);
  });
});

router.get('/product/create', (req, res) => {

  category_controller.get.all()
    .then((categories) => {
      res.render('product/create', {
        pageTitle: "Create Product",
        categories: categories
      });
    });
});

router.get('/product/modify', (req, res) => {
  product_controller.get.byId(req.query.id)
  .then((result) => {
    category_controller.get.all()
    .then((categories) => {
      res.render('product/modify', {
        pageTitle: "Modify Product",
        product: result[0],
        categories: categories
      });
    });
  })
  .catch((error) => {
    console.error(error);
  });
});;

router.post('/product/save', (req, res) => {
  product_controller.save(req)
  .then((source_id) => {
    relations_controller.save(source_id, req.body.cat_id)
    .then(() => {
      res.redirect('/product/?save=true&name=' + req.body.name);
    });
  })
  .catch((error) => {
    console.error(error);
  });
});

router.post('/product/update', (req, res) => {
  product_controller.update(req)
  .then(() => {
    relations_controller.get.bySourceId(req.body.id)
    .then((result) => {
      if(result.length)
        relations_controller.update(req.body.id, req.body.cat_id)
      else 
        relations_controller.save(req.body.id, req.body.cat_id)
      .then(() => {
        res.redirect('/product/?update=true&name=' + req.body.name);
      });
    })
  })
  .catch((error) => {
    console.error(error);
  });
});

router.post('/product/delete', (req, res) => {
  product_controller.delete(req.query.id)
  .then(() => {
    relations_controller.delete.bySourceId(req.query.id)
    .then(() => {
      res.redirect('/product/?delete=true&name=' + req.body.name);
    });
  })
  .catch((error) => {
    console.error(error);
  });
});

module.exports = router;