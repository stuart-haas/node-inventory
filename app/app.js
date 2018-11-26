var express = require('express');
var reload = require('reload');
var app = express();

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'jade');
app.set('views', 'app/views');

app.locals.siteTitle = "Inventory";

app.use(express.static('app/public'));
app.use(require('./routes/index'));

app.listen(app.get('port'), (req, res) =>
{
  console.log('listening on port ' + app.get('port'));
});

reload(app);
