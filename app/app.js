const express = require('express');
const app = express();
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const bodyParser = require('body-parser');
const router = express.Router();
const reload = require('reload');

const knex = require('./db/knex.db');

const Index = require('./model/index.model');
const User = require('./model/user.model');
const Product = require('./model/product.model');
const Category = require('./model/category.model');
const Relation = require('./model/relation.model');

// Build schemas
User.schema.build();
Product.schema.build();
Category.schema.build();
Relation.schema.build();

// Set server port
app.set('port', process.env.PORT || 3000);

// Set view engine to jade
app.set('view engine', 'jade');
app.set('views', 'app/views');

// Set locals
app.locals.siteTitle = "Inventory";

// Generate sessions
var sessionStore = new MySQLStore(knex.client.config.connection);

app.use(session({
  key: 'sid',
  secret: 'secret',
  store: sessionStore,
  resave: false,
  saveUninitialized: false
}));

// Add body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Add router
app.use(router);

// Add static content
app.use(express.static('app/static'));

// Add routes
app.use(Index.route);
app.use(User.route);
app.use(Product.route);
app.use(Category.route);

app.use((req, res, next) => {
  if(req.session && req.session.user) {
    User.query.get.byId(req.session.user.id)
    .then((user) => {
      if (user) {
        delete user.password;
        req.session.user = user;
        app.locals.user = req.session.user;
      }
      next();
    });
  } else {
    app.locals.users = null;
    next();
  }
});

// Add listener to server
app.listen(app.get('port'), (req, res) => {
  console.log('listening on port ' + app.get('port'));
});

reload(app);
