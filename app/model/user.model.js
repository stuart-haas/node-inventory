const bcrypt = require('bcrypt');

exports.route = require('../route/user.route');
exports.query = require('../query/user.query');
exports.schema = require('../schema/user.schema');

exports.authenticate = (username, password, callback) => {
  exports.query.get.byUserName(username)
  .then((user) => {
    if(!user.length) {
      return callback(username, true, false);
    } else {
      bcrypt.compare(password, user[0].password, (error, result) => {
        if(result)
          return callback(user, false, false);
        else
          return callback(user, false, true);
      });
    }
  });
}