const express = require('express');
const router = express.Router();

const Session = require('../model/session.model');

router.get('/', (req, res) => {
  res.status(301).redirect('/dashboard');
});

router.get('/dashboard', Session.requireLogin, (req, res) => {
  var path = req.path.replace(/\//g, "");

  res.render('index', { 
    pageTitle: "Dashboard", 
    path: path, 
    user: req.session.user 
  });
});

module.exports = router;