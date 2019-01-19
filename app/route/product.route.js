const express = require('express');
const router = express.Router();

const product = require('../db/product.db');
const category = require('../db/category.db');
const relation = require('../db/relation.db');

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
  product.query.get.byId(req.query.id)
  .then((result) => {
    category.query.get.all()
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
  product.query.save(req)
  .then((source_id) => {
    if(req.body.cat_id)
      relation.query.save(source_id, req.body.cat_id)
      .then(() => {
        res.redirect('/product/?save=true&name=' + req.body.name);
      })
    else
      res.redirect('/product/?save=true&name=' + req.body.name);
  })
  .catch((error) => {
    console.error(error);
  });
});

router.post('/product/update', (req, res) => {
  product.query.update(req)
  .then(() => {
    relation.query.get.bySourceId(req.body.id)
    .then((result) => {
      if(req.body.cat_id) {
        if(result.length)
          relation.query.update(req.body.id, req.body.cat_id)
          .then(() => {
            res.redirect('/product/?update=true&name=' + req.body.name);
          })
        else {
          relation.query.save(req.body.id, req.body.cat_id)
          .then(() => {
            res.redirect('/product/?update=true&name=' + req.body.name);
          })
        }
      }
      else
        res.redirect('/product/?update=true&name=' + req.body.name);
    })
  })
  .catch((error) => {
    console.error(error);
  });
});

router.post('/product/delete', (req, res) => {
  product.query.delete(req.query.id)
  .then(() => {
    relation.query.get.bySourceId(req.query.id)
    .then((result) => {
      if(result.length) {
        relation.query.delete.bySourceId(req.query.id)
        .then(() => {
          res.redirect('/product/?delete=true&name=' + req.body.name);
        });
      }
      else 
        res.redirect('/product/?delete=true&name=' + req.body.name);
    });
  })
  .catch((error) => {
    console.error(error);
  });
});

module.exports = router;