exports.requiresLogin = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  } else {
    var error = new Error();
    error.message = "You must be logged in to view this page.";
    error.status = 401;
    res.render('error', { pageTitle: error.status, error : error });
  }
}