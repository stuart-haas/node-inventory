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
  if (req.session.userId) {
    res.redirect('/profile');
  } else {
    res.render('admin/login', { pageTitle: "Login" });
  }
});

router.get('/profile', Session.requiresLogin, (req, res) => {
  User.query.get.byId(req.session.userId)
  .then((user) => {
    return res.render('admin/profile', { pageTitle: "Profile", username: user.username })
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
  User.authenticate(req.body.username, req.body.password, (user, error) => {
    if(error) {
      if(error == User.ERROR.USER.NO_MATCH)
        res.render('admin/login', { pageTitle: "Login", username: user, error: { username: "Wrong username" }});
      else if(error == User.ERROR.PASSWORD.NO_MATCH)
        res.render('admin/login', { pageTitle: "Login", username: user, error: { password: "Wrong password" }});
    } else {
      req.session.userId = user.id;
      res.redirect('/');
    }
  });
});

router.post('/user/save', (req, res) => {
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
          res.redirect('/admin/login');
        });
      });
    }
  });
});

module.exports = router;