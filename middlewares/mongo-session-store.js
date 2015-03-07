var winston = require('winston');
var nconf = require('nconf');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');

module.exports = function () {
    var dbSessionStore = new MongoStore({
        mongooseConnection: mongoose.connection
    });

    return function (req, res, next) {
        if(typeof dbSessionStore === 'undefined') {
          winston.warn("MongoStore is undefined");
          return next();
        }
        
        var sessionID = req.signedCookies['express.sid'];
        winston.info("sessionID=" + sessionID);
        dbSessionStore.get(sessionID, function (err, sessionData) {
            if (!err && sessionData && sessionData.passport && sessionData.passport.user) {
                uid = parseInt(sessionData.passport.user);
            } else {
                uid = 0;
            }

            if (uid) {
                winston.info("User with uid=" + uid + " found !");
                // Access to user id from response locals
                res.locals.user = sessionData.passport.user;
            } else {
                winston.info("User with uid=" + uid + " NOT found !");
            }
            next();
        });    
    }
};