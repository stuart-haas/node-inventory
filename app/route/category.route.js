const express = require('express');
const router = express.Router();

const category = require('../model/category.model');
const relation = require('../model/relation.model');

router.get('/category', (req, res) => {
  var path = req.path.replace(/\//g, "");
  var query = req.query;

  category.query.get.all()
  .then((result) => {
    res.render('category', {
      pageTitle: "Categories",
      path: path,
      query: query,
      categories: result,
    });
  })
  .catch((error) => {
    console.error(error);
  });
});

router.get('/category/create', (req, res) => {

  res.render('category/create', {
    pageTitle: "Create Category"
  });
});

router.get('/category/modify', (req, res) => {
  category.query.get.byId(req.query.id)
  .then((result) => {
    res.render('category/modify', {
      pageTitle: "Modify Category",
      category: result[0]
    });
  })
  .catch((error) => {
    console.error(error);
  });
});;

router.post('/category/save', (req, res) => {
  category.query.save(req)
  .then(() => {
    res.redirect('/category/?save=true&name=' + req.body.cat_name);
  })
  .catch((error) => {
    console.error(error);
  });
});

router.post('/category/update', (req, res) => {
  category.query.update(req)
  .then(() => {
    res.redirect('/category/?update=true&name=' + req.body.cat_name);
  })
  .catch((error) => {
    console.error(error);
  });
});

router.post('/category/delete', (req, res) => {
  category.query.delete(req.query.id)
  .then(() => {
    relation.query.delete.byTargetId(req.query.id)
    .then(() => {
      res.redirect('/category/?delete=true&name=' + req.body.cat_name);
    });
  })
  .catch((error) => {
    console.error(error);
  });
});

module.exports = router;