const express = require('express');

const index = require('./routes/index.route');
const product = require('./routes/product.route');
const category = require('./routes/category.route');

const bodyParser = require('body-parser');

const reload = require('reload');
const app = express();

// Set server port
app.set('port', process.env.PORT || 3000);

// Set jade for view engine
app.set('view engine', 'jade');
app.set('views', 'app/views');

// Set global view variables
app.locals.siteTitle = "Inventory";

app.locals.total = (x1, x2) => {
  return x1 * x2;
}

// Initialize body parser for post requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Initialize and set router
const router = express.Router();
app.use(router)

// Serve static files
app.use(express.static('app/static'));

// Add routes
app.use(index);
app.use(product);
app.use(category);

// Add listener to server
app.listen(app.get('port'), (req, res) =>
{
  console.log('listening on port ' + app.get('port'));
});

reload(app);
