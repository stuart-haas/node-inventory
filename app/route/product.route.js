const express = require('express');
const router = express.Router();

const product = require('../model/product.model');
const category = require('../model/category.model');
const relation = require('../model/relation.model');

router.get('/product', (req, res) => {
  var path = req.path.replace(/\//g, "");
  var query = req.query;

  product.query.get.all()
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

  category.query.get.all()
    .then((categories) => {
      res.render('product/create', {
        pageTitle: "Create Product",
        categories: categories
      });
    });
});

router.get('/product/modify', (req, res) => {
  Promise.all([product.query.get.byId(req.query.id), category.query.get.all()])
  .then((results) => {
    res.render('product/modify', {
      pageTitle: "Modify Product",
      product: results[0],
      categories: results[1]
    });
  })
  .catch((error) => {
    console.error(error);
  });
});;

router.post('/product/save', (req, res) => {
  product.query.save(req)
  .then((source_id) => {
    if(req.body.cat_id)
      return Promise.resolve(relation.query.save(source_id, req.body.cat_id))
  })
  .then(() => {
    res.redirect('/product/?save=true&name=' + req.body.name);
  })
  .catch((error) => {
    console.error(error);
  });
});

router.post('/product/update', (req, res) => {
  Promise.all([product.query.update(req), relation.query.get.bySourceId(req.body.id)])
  .then((result) => {
    if(result)
      if(req.body.cat_id) {
        return Promise.resolve(relation.query.update(req.body.id, req.body.cat_id));
      }
      else {
        return Promise.resolve(relation.query.delete.bySourceId(req.body.id));
      }
    else {
      return Promise.resolve(relation.query.save(req.body.id, req.body.cat_id));
    }
  })
  .then(() => {
    res.redirect('/product/?update=true&name=' + req.body.name);
  })
  .catch((error) => {
    console.error(error);
  });
});

router.post('/product/delete', (req, res) => {
  Promise.all([product.query.delete(req.query.id), relation.query.delete.bySourceId(req.query.id)])
  .then(() => {
    res.redirect('/product/?delete=true&name=' + req.body.name);
  })
  .catch((error) => {
    console.error(error);
  })
});

module.exports = router;