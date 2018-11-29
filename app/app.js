const express = require('express');

const index = require('./routes/index.route');
const products = require('./routes/product.route');

const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const reload = require('reload');
const app = express();

// Connect to database
let dbRoute = "mongodb://node-inventory:aVukXTMEvZuo9DsuZz49@ds145370.mlab.com:45370/node-inventory";
mongoose.connect(dbRoute, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.once("open", () => console.log("connected to the database"));
db.on("error", console.error.bind(console, "MongoDB connection error:"))

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
app.use(products);

// Add listener to server
app.listen(app.get('port'), (req, res) =>
{
  console.log('listening on port ' + app.get('port'));
});

reload(app);
