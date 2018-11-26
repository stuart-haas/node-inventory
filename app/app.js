const express = require('express');
const reload = require('reload');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const index = require('./routes/index.route');
const products = require('./routes/product.route');
const app = express();

let dbRoute = "mongodb://node-inventory:aVukXTMEvZuo9DsuZz49@ds145370.mlab.com:45370/node-inventory";
mongoose.connect(dbRoute, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.once("open", () => console.log("connected to the database"));
db.on("error", console.error.bind(console, "MongoDB connection error:"))

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'jade');
app.set('views', 'app/views');

app.locals.siteTitle = "Inventory";

app.use(express.static('app/static'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/', index);
app.use('/products', products);

app.listen(app.get('port'), (req, res) =>
{
  console.log('listening on port ' + app.get('port'));
});

reload(app);
