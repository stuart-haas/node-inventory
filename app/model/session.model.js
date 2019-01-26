exports.requireLogin = (req, res, next) => {
  if(!req.session.user) {
    res.redirect('/login');
  } else {
    next();
  }
};

exports.requireRole = (role) => {
  return (req, res, next) => {
    if(req.session.user && req.session.user.role == role) {
      next();
    } else {
      res.send(403);
    }
  }
};

exports.redirect = (url) => {
  return (req, res, next) => {
    if(req.session && req.session.user) {
        res.redirect(url);
    } else {
        next();
    }   
  }
};

exports.destroy = (req, res, next) => {
  if(req.session) {
    req.session.destroy((error) => {
      if(error) {
        return next(error);
      } else {
        res.redirect('/');
      }
    });
  }
};
