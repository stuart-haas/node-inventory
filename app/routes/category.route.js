const express = require('express');
const router = express.Router();

const category_controller = require('../controllers/category.controller');
const relations_controller = require('../controllers/relations.controller');

router.get('/category', (req, res) => {
  var path = req.path.replace(/\//g, "");
  var query = req.query;

  category_controller.get.all()
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
  category_controller.get.byId(req.query.id)
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
  category_controller.save(req)
  .then(() => {
    res.redirect('/category/?save=true&name=' + req.body.cat_name);
  })
  .catch((error) => {
    console.error(error);
  });
});

router.post('/category/update', (req, res) => {
  category_controller.update(req)
  .then(() => {
    res.redirect('/category/?update=true&name=' + req.body.cat_name);
  })
  .catch((error) => {
    console.error(error);
  });
});

router.post('/category/delete', (req, res) => {
  category_controller.delete(req.query.id)
  .then(() => {
    relations_controller.delete.byTargetId(req.query.id)
    .then(() => {
      res.redirect('/category/?delete=true&name=' + req.body.cat_name);
    });
  })
  .catch((error) => {
    console.error(error);
  });
});

module.exports = router;