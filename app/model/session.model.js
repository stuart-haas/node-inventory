exports.requireLogin = (req, res, next) => {
  if (!req.session.user) {
    res.redirect('/login');
  } else {
    return next();
  }
}

exports.refer = (url) => {
  return (req, res, next) => {
    if (req.session.user) {
        res.redirect(url);
    } else {
        next();
    }   
  }
};