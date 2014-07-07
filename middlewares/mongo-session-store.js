var nconf = require('nconf');
var session = require('express-session');
var mongoClient = require('mongodb').MongoClient;
var MongoStore = require('connect-mongo')(session);

module.exports = function () {
    var dbSessionStore;
    mongoClient.connect('mongodb://' + nconf.get('mongo:host') + ':' + nconf.get('mongo:port') + '/' + nconf.get('mongo:database'), function (err, db) {
        if (err) {
            console.warn("NodePoule could not connect to your Mongo database. Mongo returned the following error: " + err.message);
            process.exit();
        }
        dbSessionStore = new MongoStore({
            db: db,
        });
        if (nconf.get('mongo:password') && nconf.get('mongo:username')) {
            db.authenticate(nconf.get('mongo:username'), nconf.get('mongo:password'), function (err) {
                if (err) {
                    console.error(err.message);
                    process.exit();
                }
            });
        } else {
            console.warn('You have no mongo password setup!');
            process.exit();
        }
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