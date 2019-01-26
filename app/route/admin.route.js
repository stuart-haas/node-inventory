const express = require('express');
const router = express.Router();

const Session = require('../model/session.model');
const File = require('../model/file.model');

router.get('/admin', Session.requireRole(1), (req, res) => {
  var path = req.path.replace(/\//g, "");

  res.render('admin', { 
    pageTitle: "Admin",
    path: path,
    user: req.session.user 
  });
});

router.post('/upload', File.upload, (req, res) => {
  res.redirect('/admin');
});

module.exports = router;