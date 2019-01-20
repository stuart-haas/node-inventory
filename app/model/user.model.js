const bcrypt = require('bcrypt');

exports.route = require('../route/user.route');
exports.query = require('../query/user.query');
exports.schema = require('../schema/user.schema');

exports.ERROR = {
  USER: {
    MATCH: "USER_MATCH",
    NO_MATCH: "USER_NO_MATCH"
    
  },
  PASSWORD: {
    NO_MATCH: "PASSWORD_NO_MATCH"
  }
}

exports.validate = (username, password, passwordConf, callback) => {
  exports.query.get.byUserName(username)
  .then((user) => {
    if(user.length) {
      return callback(username, null, exports.ERROR.USER.MATCH);
    } else {
      if(password == passwordConf) {
        return callback(username, password);
      }
      else {
        return callback(username, null, exports.ERROR.PASSWORD.NO_MATCH);
      }
    }
  });
}

exports.authenticate = (username, password, callback) => {
  exports.query.get.byUserName(username)
  .then((user) => {
    if(!user.length) {
      return callback(username, exports.ERROR.USER.NO_MATCH);
    } else {
      bcrypt.compare(password, user[0].password, (error, result) => {
        if(result)
          return callback(user, null);
        else
          return callback(user, exports.ERROR.PASSWORD.NO_MATCH);
      });
    }
  });
}