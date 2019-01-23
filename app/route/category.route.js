const express = require('express');
const router = express.Router();

const Session = require('../model/session.model');
const Category = require('../model/category.model');
const Relation = require('../model/relation.model');

router.get('/category', Session.requireLogin, (req, res) => {
  var path = req.path.replace(/\//g, "");
  var query = req.query;

  Category.query.get.all()
  .then((result) => {
    res.render('category', {
      pageTitle: "Categories",
      path: path,
      query: query,
      categories: result,
      user: req.session.user
    });
  })
  .catch((error) => {
    console.error(error);
  });
});

router.get('/category/create', Session.requireLogin, (req, res) => {

  res.render('category/create', {
    pageTitle: "Create Category",
    user: req.session.user
  });
});

router.get('/category/modify', Session.requireLogin, (req, res) => {
  Category.query.get.byId(req.query.id)
  .then((result) => {
    res.render('category/modify', {
      pageTitle: "Modify Category",
      category: result,
      user: req.session.user
    });
  })
  .catch((error) => {
    console.error(error);
  });
});;

router.post('/category/save', Session.requireLogin, (req, res) => {
  Category.query.save(req)
  .then(() => {
    res.redirect('/category/?save=true&name=' + req.body.cat_name);
  })
  .catch((error) => {
    console.error(error);
  });
});

router.post('/category/update', Session.requireLogin, (req, res) => {
  Category.query.update(req)
  .then(() => {
    res.redirect('/category/?update=true&name=' + req.body.cat_name);
  })
  .catch((error) => {
    console.error(error);
  });
});

router.post('/category/delete', Session.requireLogin, (req, res) => {
  Promise.all([Category.query.delete(req.query.id), Relation.query.delete.byTargetId(req.query.id)])
  .then(() => {
    res.redirect('/category/?delete=true&name=' + req.body.cat_name);
  })
  .catch((error) => {
    console.error(error);
  });
});

module.exports = router;