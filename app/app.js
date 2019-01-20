const express = require('express');
const app = express();
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const bodyParser = require('body-parser');
const router = express.Router();
const reload = require('reload');

const knex = require('./db/knex.db');
const index = require('./model/index.model');
const user = require('./model/user.model');
const product = require('./model/product.model');
const category = require('./model/category.model');
const relation = require('./model/relation.model');

// Build schemas
user.schema.build();
product.schema.build();
category.schema.build();
relation.schema.build();

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
app.use(router)

// Add static content
app.use(express.static('app/static'));

// Add routes
app.use(index.route);
app.use(user.route);
app.use(product.route);
app.use(category.route);

// Add listener to server
app.listen(app.get('port'), (req, res) =>
{
  console.log('listening on port ' + app.get('port'));
});

reload(app);
