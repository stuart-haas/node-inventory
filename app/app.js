const express = require('express');

const index = require('./route/index.route');
const product = require('./route/product.route');
const category = require('./route/category.route');

const bodyParser = require('body-parser');

const reload = require('reload');
const app = express();

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
const router = express.Router();
app.use(router)

// Add static content
app.use(express.static('app/static'));

// Add route
app.use(index);
app.use(product);
app.use(category);

// Add listener to server
app.listen(app.get('port'), (req, res) =>
{
  console.log('listening on port ' + app.get('port'));
});

reload(app);
