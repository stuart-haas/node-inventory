const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const User = require('../model/user.model');
const Session = require('../model/session.model');

router.get('/admin', (req, res) => {
  res.render('admin', { pageTitle: "Admin" });
});

router.get('/admin/register', (req, res) => {
  res.render('admin/register', { pageTitle: "Register" });
});

router.get('/admin/login', (req, res) => {
  res.render('admin/login', { pageTitle: "Login" });
});

router.get('/profile', Session.requiresLogin, (req, res) => {
  User.query.get.byId(req.session.userId)
  .then((user) => {
    return res.render('admin/profile', { pageTitle: "Profile", username: user[0].username })
  })
});

router.get('/logout', (req, res, next) => {
  if (req.session) {
    req.session.destroy((error) => {
      if (error) {
        return next(error);
      } else {
        return res.redirect('/admin/login');
      }
    });
  }
});

router.post('/user', (req, res) => {
  User.authenticate(req.body.username, req.body.password, (user, userError, passwordError) => {
    if(userError) {
      res.render('admin/login', { pageTitle: "Login", username: user, error: { username: "Wrong username" }});
    } else if(passwordError) {
      res.render('admin/login', { pageTitle: "Login", username: user[0].username, error: { password: "Wrong password" }});
    } else {
      req.session.userId = user[0].id;
      res.redirect('/profile');
    }
  });
});

router.post('/user/save', (req, res) => {
  bcrypt.hash(req.body.password, 10, function(err, hash) {
    req.body.password = hash;
    User.query.save(req)
    .then(() => {
      res.redirect('/admin/login');
    });
  });
});

module.exports = router;