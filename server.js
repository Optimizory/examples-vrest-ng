var express = require('express'),
  cors = require('cors'),
  bodyParser = require("body-parser"),
  path = require('path'),
  http = require('http'),
  contact = require('./routes/contacts'),
  home = require('./routes/home');

var app = express(),
  baseURL = process.env.baseURL || '/',
  instanceType = 'Test';

if (baseURL.indexOf('prod') !== -1) {
  instanceType = 'Production';
}

app.use(cors());

app.locals.baseURL = baseURL;
app.locals.instanceType = instanceType;

app.disable('etag');

app.set('port', process.env.PORT || 3000);
// app.use(express.logger('dev')); /* 'default', 'short', 'tiny', 'dev' */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set('views', path.join(__dirname, 'public'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

var requiresLogin = function (req, res, next) {
  next();
};

app.post('/contacts/rePopulateDB', requiresLogin, contact.rePopulateDB);
app.get('/contacts', requiresLogin, contact.findAll);
app.get('/contacts/:id', requiresLogin, contact.findById);
app.post('/contacts', requiresLogin, contact.addcontact);
app.put('/contacts/:id', requiresLogin, contact.updatecontact);
app.delete('/contacts/:id', requiresLogin, contact.deletecontact);

app.get('/', home.index);

http.createServer(app).listen(app.get('port'), function () {
  console.log("Express server listening on port " + app.get('port'));
});