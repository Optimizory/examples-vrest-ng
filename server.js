var express = require('express'),
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

app.locals = {
  baseURL: process.env.baseURL || '/',
  instanceType: instanceType
};

app.disable('etag');

app.configure(function () {
  app.set('port', process.env.PORT || 3000);
  app.use(express.logger('dev')); /* 'default', 'short', 'tiny', 'dev' */
  app.use(express.bodyParser());
  app.set('views', path.join(__dirname, 'public'));
  app.engine('html', require('ejs').renderFile);
  app.set('view engine', 'html');
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

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