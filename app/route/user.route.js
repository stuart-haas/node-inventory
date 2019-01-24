const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const Session = require('../model/session.model');
const User = require('../model/user.model');
const File = require('../model/file.model');

router.get('/profile', Session.requireLogin, (req, res) => {
  var path = req.path.replace(/\//g, "");

  User.query.get.byId(req.session.user.id)
  .then((user) => {
    res.render('user/profile', { 
      pageTitle: "Profile",
      path: path,
      user: req.session.user 
    });
  })
});

router.post('/profile/update', Session.requireLogin, (req, res) => {
  User.query.update(req)
    .then((user) => {
      res.redirect('/profile?update=true');
    });
});

router.get('/register', Session.redirect('/profile'), (req, res) => {
  res.render('admin/register', { 
    pageTitle: "Register",
    user: req.session.user 
  });
});

router.post('/register', (req, res) => {
  User.validate(req.body.username, req.body.password, req.body.passwordConf, (user, password, error) => {
    if(error) {
      if(error == User.ERROR.USER.MATCH) {
        res.render('admin/register', { 
          pageTitle: "Register", 
          username: user, 
          error: { username: "Username already exists" }
        });
      } else if(error == User.ERROR.PASSWORD.NO_MATCH) {
        res.render('admin/register', { 
          pageTitle: "Register", 
          username: user, 
          error: { password: "Passwords do not match" }
        });
      }
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

router.get('/login', Session.redirect('/profile'), (req, res) => {
  res.render('admin/login', { 
    pageTitle: "Login", 
    user: req.session.user 
  });
});

router.post('/login', (req, res) => {
  User.authenticate(req.body.username, req.body.password, (user, error) => {
    if(error) {
      if(error == User.ERROR.USER.NO_MATCH) {
        res.render('admin/login', { 
          pageTitle: "Login", 
          username: user, error: { username: "Username does not exist" }
        });
      } else if(error == User.ERROR.PASSWORD.NO_MATCH) {
        res.render('admin/login', { 
          pageTitle: "Login", 
          username: user, 
          error: { password: "Wrong password" }
        });
      }
    } else {
      req.session.user = user;
      res.redirect('/dashboard');
    }
  });
});

router.get('/logout', (req, res, next) => {
  Session.destroy(req, res);
});

module.exports = router;