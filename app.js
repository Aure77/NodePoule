var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var	path = require('path');
var nconf = require('nconf');
var util = require('util');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.set('debug', true);

loadConfig();

if(nconf.get('database') === 'mongo') {
  // load DB models
  require('./models/user.js');
  require('./models/game.js');
  require('./models/user-profil.js');
  require('./models/tournament.js');
  require('./models/deck.js');
  require('./models/news.js');
  // connect to db with keepAlive
  var dbUri = 'mongodb://' + nconf.get('mongo:host') + ':' + nconf.get('mongo:port') + '/' + nconf.get('mongo:database');
  mongoose.connect(dbUri, { 
    user: nconf.get('mongo:username'), 
    pass: nconf.get('mongo:password'),
    server: { 
      keepAlive: 1,
      auto_reconnect: true
    }
  }); 
  var conn = mongoose.connection;  
  conn.on('error', function (err) {
    console.log('Mongoose failed to connect:', dbUri, err);
    mongoose.disconnect();
  }).on('close', function () {
    console.log('Mongoose connection closed:', dbUri);
  }).once('open', function () {
    console.log('Mongoose connection opened:', dbUri);
  });
}

// Declare routes
var routes = require('./routes/index');
var tournaments = require('./routes/tournaments');
var profile = require('./routes/profile');
var news = require('./routes/news');
var faq = require('./routes/faq');
var games = require('./routes/games');
var hearthstoneDecks = require('./routes/hearthstone-decks');
var admin = require('./routes/admin');

var app = express();

// application variables provided to all templates
app.locals.staticsPrefixPath = nconf.get('statics_prefix_path');
app.locals.baseUrl = nconf.get('base_url');
app.locals.forumUrl = nconf.get('forum_url');

// view engine setup
app.set('views', path.join(__dirname, 'views/bootstrap'));
app.set('view engine', 'jade');

// setup middlewares
app.use(favicon(__dirname + '/public/bootstrap/img/favicon.png'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(nconf.get('secret')));
app.use(express.static(path.join(__dirname, 'public/bootstrap')));

if(nconf.get('database') === 'mongo') {
  app.use(require('./middlewares/mongo-session-store')());
}

// Middleware for every request
app.use(function(req, res, next) {
  // setup global response variables
  res.locals.currentReqPath = req.path; // setup current uri path
  next();
});

function requireAuthentication(req, res, next) {
  if (res.locals.user == null) { // not logged in
  console.log(req.headers);
    if(req.xhr || req.headers.accept.indexOf('json') > -1) { // requete ajax
      var redirectUrl = util.format("%s/login?next=%s", nconf.get("forum_url"), req.headers.referer);
      console.log("[xhr] redirect to " + redirectUrl);
      res.redirect(401, redirectUrl); // 401 for ajax ?
    } else {
      var redirectUrl = util.format("%s/login?next=%s%s", nconf.get("forum_url"), nconf.get("base_url"), req.originalUrl);
      console.log("redirect to " + redirectUrl);
      res.redirect(redirectUrl); // 302
    }
  } else {
    next();
  }
}
// setup path who need credentials (redirect to login page if necessary)
app.all(['/profile/*', '/tournaments/:id/*'], requireAuthentication);

// define routes path
app.use('/', routes);
app.use('/tournaments', tournaments);
app.use('/news', news);
app.use('/profile', profile);
app.use('/faq', faq);
app.use('/games', games);
app.use('/hearthstone-decks', hearthstoneDecks);
app.use('/admin', admin);



/// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
          message: err.message,
          error: err
      });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
      message: err.message,
      error: {}
  });
});

function loadConfig() {
  nconf.file({
      file: path.join(__dirname, '/config.json')
  });

  nconf.defaults({
      base_dir: __dirname
  });
}

module.exports = app;