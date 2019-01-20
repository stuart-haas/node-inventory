const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const Session = require('../model/session.model');
const User = require('../model/user.model');

router.get('/admin', (req, res) => {
  res.render('admin', { pageTitle: "Admin" });
});

router.get('/profile', Session.requireLogin, (req, res) => {
  User.query.get.byId(req.session.user.id)
  .then((user) => {
    res.render('user/profile', { pageTitle: "Profile", sessionId: req.session.user.id, username: user.username })
  })
});

router.get('/logout', (req, res, next) => {
  if (req.session) {
    req.session.destroy((error) => {
      if (error) {
        return next(error);
      } else {
        res.redirect('/');
      }
    });
  }
});

router.get('/login', Session.refer('/profile'), (req, res) => {
  res.render('admin/login', { pageTitle: "Login" });
});

router.post('/login', (req, res) => {
  User.authenticate(req.body.username, req.body.password, (user, error) => {
    if(error) {
      if(error == User.ERROR.USER.NO_MATCH)
        res.render('admin/login', { pageTitle: "Login", username: user, error: { username: "Wrong username" }});
      else if(error == User.ERROR.PASSWORD.NO_MATCH)
        res.render('admin/login', { pageTitle: "Login", username: user, error: { password: "Wrong password" }});
    } else {
      req.session.user = user;
      res.redirect('/dashboard');
    }
  });
});

router.get('/register', Session.refer('/profile'), (req, res) => {
  res.render('admin/register', { pageTitle: "Register" });
});

router.post('/register', (req, res) => {
  User.validate(req.body.username, req.body.password, req.body.passwordConf, (user, password, error) => {
    if(error) {
      if(error == User.ERROR.USER.MATCH)
        res.render('admin/register', { pageTitle: "Register", username: user, error: { username: "Username already exists" }});
      else if(error == User.ERROR.PASSWORD.NO_MATCH)
        res.render('admin/register', { pageTitle: "Register", username: user, error: { password: "Passwords do not match" }});
    }
    else {
      bcrypt.hash(password, 10, function(err, hash) {
        User.query.save(user, hash)
        .then(() => {
          res.redirect('/login');
        });
      });
    }
  });
});

module.exports = router;