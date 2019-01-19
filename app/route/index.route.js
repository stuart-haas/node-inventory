const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.status(301).redirect('/dashboard');
});

router.get('/dashboard', (req, res) => {
  var path = req.path.replace(/\//g, "");

  res.render('index', {
    pageTitle: "Dashboard",
    path: path
  });
});

module.exports = router;