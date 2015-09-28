var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var path = require('path');
var nconf = require('nconf');
var util = require('util');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.set('debug', true);
var logger = require('./modules/logger.js');

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
// enable web server logging; pipe those log messages through winston
app.use(require('morgan')("combined", { stream: logger.stream }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(nconf.get('secret')));
app.use(express.static(path.join(__dirname, 'public/bootstrap')));

if (nconf.get('database') === 'mongo') {
  //app.use(require('./middlewares/mongo-session-store')());
  
  // Create Mongo DB Store (like NodeBB)
  var MongoStore = require('connect-mongo')(session);
  var dbSessionStore = new MongoStore({
    mongooseConnection: mongoose.connection,
    collection: 'sessions'
  });

  // Use Mongo DB Store as Session store (using same NodeBB's name/secret)
  app.use(session({
    name: 'express.sid',
    secret: nconf.get('secret'),
    resave: false,
    saveUninitialized: false,
    store: dbSessionStore
  }));

  // Initialize passport like NodeBB (to get authenticated user id)
  var passport = require('passport');
  //var PassportLocalStrategy = require('passport-local').Strategy;

  app.use(passport.initialize());
	app.use(passport.session());
   
  var User = mongoose.model('User');
    
  passport.use(User.createStrategy());

  //passport.serializeUser(User.serializeUser());
  passport.serializeUser(function (user, done) {
    logger.debug("user", user);
    done(null, user.uid);
  });
  
  passport.deserializeUser(User.deserializeUser());  
  /*passport.deserializeUser(function (uid, done) {
    done(null, {
      uid: uid
    });
  });*/

  // Simple middleware to add uid in the request
  app.use(function (req, res, next) {
    req.uid = req.user ? parseInt(req.user.uid, 10) : 0;
    res.locals.user = req.user;
    logger.debug("req.uid=%s", req.uid);
    next();
  });
  
}

// Middleware for every request
app.use(function(req, res, next) {
  // setup global response variables
  res.locals.currentReqPath = req.path; // setup current uri path
  next();
});

function requireAuthentication(req, res, next) {
  if (req.user) {
    next();
  } else { // not logged in
    logger.debug(req.headers);
    if (req.xhr || req.headers.accept.indexOf('json') > -1) { // requete ajax
      var redirectUrl = util.format("%s/login?next=%s", nconf.get("forum_url"), req.headers.referer);
      logger.info("[xhr] redirect to %s", redirectUrl);
      res.redirect(401, redirectUrl); // 401 for ajax ?
    } else {
      var redirectUrl = util.format("%s/login?next=%s%s", nconf.get("forum_url"), nconf.get("base_url"), req.originalUrl);
      logger.info("redirect to %s", redirectUrl);
      res.redirect(redirectUrl); // 302
    }
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