const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const router = express.Router();
const reload = require('reload');

const index = require('./model/index.model');
const product = require('./model/product.model');
const category = require('./model/category.model');
const relation = require('./model/relation.model');

// Build schemas
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

// Add body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Add router
app.use(router)

// Add static content
app.use(express.static('app/static'));

// Add routes
app.use(index.route);
app.use(product.route);
app.use(category.route);

// Add listener to server
app.listen(app.get('port'), (req, res) =>
{
  console.log('listening on port ' + app.get('port'));
});

reload(app);
