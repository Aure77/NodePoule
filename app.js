var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var	path = require('path');
var nconf = require('nconf');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

loadConfig();

if(nconf.get('database') === 'mongo') {
  // load models
  require('./models/game.js');
  require('./models/user-profil.js');
  require('./models/tournament.js');
  require('./models/deck.js');
  // connect to db
  var dbUri = 'mongodb://' + nconf.get('mongo:host') + ':' + nconf.get('mongo:port') + '/' + nconf.get('mongo:database');
  mongoose.connect(dbUri, { 
    user: nconf.get('mongo:username'), 
    pass: nconf.get('mongo:password'),
    server: { 
      keepAlive: 1, 
      auto_reconnect: true, 
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

var routes = require('./routes/index');
var users = require('./routes/users');
var tournaments = require('./routes/tournaments');
var profile = require('./routes/profile');
var hearthstoneDecks = require('./routes/hearthstone-decks');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser(nconf.get('secret')));
app.use(express.static(path.join(__dirname, 'public')));

if(nconf.get('database') === 'mongo') {
  app.use(require('./middlewares/mongo-session-store')());
}

app.use('/', routes);
app.use('/users', users);
app.use('/tournaments', tournaments);
app.use('/profile', profile);
app.use('/hearthstone-decks', hearthstoneDecks);

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
        file: path.join(__dirname, '/nodebb/config.json')
    });

    nconf.defaults({
        base_dir: __dirname
    });
}

module.exports = app;