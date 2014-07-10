var nconf = require('nconf');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');

module.exports = function () {
    var dbSessionStore = new MongoStore({
      db: mongoose.connection.db
    });

    return function (req, res, next) {
        if(typeof dbSessionStore === 'undefined') {
          console.warn("MongoStore is undefined");
          return next();
        }
        
        var sessionID = req.signedCookies['express.sid'];
        console.log("sessionID=" + sessionID);
        dbSessionStore.get(sessionID, function (err, sessionData) {
            if (!err && sessionData && sessionData.passport && sessionData.passport.user) {
                uid = parseInt(sessionData.passport.user, 10);
            } else {
                uid = 0;
            }

            if (uid) {
                console.log("User with uid=" + uid + " found !");
                // Access to user id from request
                req.user = sessionData.passport.user;
            } else {
                console.log("User with uid=" + uid + " NOT found !");
            }
            next();
        });    
    }
};