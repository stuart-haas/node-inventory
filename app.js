const express = require('express');
const app = express();
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const bodyParser = require('body-parser');
const router = express.Router();
const reload = require('reload');

// database configuration
const knex = require('./app/db/knex.db');
const sessionStore = new MySQLStore(knex.client.config.connection);

const Index = require('./app/model/index.model');
const Admin = require('./app/model/admin.model');
const User = require('./app/model/user.model');
const Product = require('./app/model/product.model');
const Category = require('./app/model/category.model');

// set locals
app.locals.siteTitle = "Inventory";

// set view engine to jade
app.set('view engine', 'jade');
app.set('views', 'app/views');

// add body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// add static content
app.use(express.static('public'));

// add router
app.use(router);

// routes
app.use(Index.route);
app.use(Admin.route);
app.use(User.route);
app.use(Product.route);
app.use(Category.route);

// session store configuration
app.use(session({
  key: 'sid',
  secret: 'secret',
  store: sessionStore,
  resave: false,
  saveUninitialized: false
}));

// set session user
app.use((req, res, next) => {
  if(req.session && req.session.user) {
    User.query.get.byId(req.session.user.id)
    .then((user) => {
      if (user) {
        req.user = user;
        delete req.user.password;
        req.session.user = user;
      }
      next();
    });
  } else {
    next();
  }
});

// set server port
app.set('port', process.env.PORT || 3000);

// add listener to server
app.listen(app.get('port'), (req, res) => {
  console.log('listening on port ' + app.get('port'));
});

reload(app);