const express = require('express');
const router = express.Router();

const Session = require('../model/session.model');
const Product = require('../model/product.model');
const Category = require('../model/category.model');
const Relation = require('../model/relation.model');

router.get('/product', Session.requireLogin, (req, res) => {
  var path = req.path.replace(/\//g, "");
  var query = req.query;

  Product.query.get.all()
  .then((results) => {
    res.render('product', {
      pageTitle: "Products",
      path: path,
      query: query,
      products: results,
      user: req.session.user
    });
  })
  .catch((error) => {
    console.error(error);
  });
});

router.get('/product/create', Session.requireLogin, (req, res) => {

  Category.query.get.all()
    .then((categories) => {
      res.render('product/create', {
        pageTitle: "Create Product",
        categories: categories,
        user: req.session.user
      });
    });
});

router.get('/product/modify', Session.requireLogin, (req, res) => {
  Promise.all([Product.query.get.byId(req.query.id), Category.query.get.all()])
  .then((results) => {
    res.render('product/modify', {
      pageTitle: "Modify Product",
      product: results[0],
      categories: results[1],
      user: req.session.user
    });
  })
  .catch((error) => {
    console.error(error);
  });
});;

router.post('/product/save', Session.requireLogin, (req, res) => {
  Product.query.save(req)
  .then((source_id) => {
    if(req.body.cat_id) {
      return Promise.resolve(Relation.query.save(source_id, req.body.cat_id));
    }
  })
  .then(() => {
    res.redirect('/product/?save=true&name=' + req.body.name);
  })
  .catch((error) => {
    console.error(error);
  });
});

router.post('/product/update', Session.requireLogin, (req, res) => {
  Promise.all([Product.query.update(req), Relation.query.get.bySourceId(req.body.id)])
  .then((result) => {
    if(result[1]) {
      if(req.body.cat_id) {
        return Promise.resolve(Relation.query.update(req.body.id, req.body.cat_id));
      }
      else {
        return Promise.resolve(Relation.query.delete.bySourceId(req.body.id));
      }
    } else {
      return Promise.resolve(Relation.query.save(req.body.id, req.body.cat_id));
    }
  })
  .then(() => {
    res.redirect('/product/?update=true&name=' + req.body.name);
  })
  .catch((error) => {
    console.error(error);
  });
});

router.post('/product/delete', Session.requireLogin, (req, res) => {
  Promise.all([Product.query.delete(req.query.id), Relation.query.delete.bySourceId(req.query.id)])
  .then(() => {
    res.redirect('/product/?delete=true&name=' + req.body.name);
  })
  .catch((error) => {
    console.error(error);
  })
});

module.exports = router;