var express = require('express');
var util = require('util');
var nconf = require('nconf');
var escape = require('escape-html');
var mongoose = require('mongoose'), UserProfil = mongoose.model('UserProfil'), User = mongoose.model('User');
var router = express.Router();

router.get('/', function(req, res, next) {
  var userId = req.user;
  if(userId == null) { // not logged in
    res.redirect(util.format("%s/login?next=%s/profile", nconf.get("forum_url"), nconf.get("base_url")));
  } else {
    findOrCreateUserProfilByUserId(userId, function(err, userProfil) {
      if (err) { return next(err); }
      res.render('profile', { title: util.format('Profile de %s', userProfil.user.username), profil: userProfil });
    });
  }
});

router.get('/:id', function(req, res, next) {
  var userId = req.user;
  if(userId == null) { // not logged in
    res.redirect(util.format("%s/login?next=%s/profile", nconf.get("forum_url"), nconf.get("base_url")));
  } else {
    findOrCreateUserProfilByUserId(escape(req.params.id), function(err, userProfil) {
      if (err) { return next(err); }
      res.render('profile', { title: util.format('Profile de %s', userProfil.user.username), profil: userProfil });
    });
  }
});

function findOrCreateUserProfilByUserId(uid, callback) {
  UserProfil.findOne({ uid: uid })
            .populate('user', '_key uid username picture gravatarpicture uploadedpicture status')
            .populate('gamerTags.game')
            .lean()
            .exec(function(err, userProfil) {
    if (err) { return callback(err, null); }
    
    if(userProfil) {
      callback(null, userProfil);
    } else {
      createDefaultUserProfil(uid, callback);
    }
  });
}

function createDefaultUserProfil(uid, callback) {
  User.findOne({ uid: uid }, '_id uid').lean().exec(function(err, user) {
    if (err) { return callback(err, null); }
    if(!user) {
      return callback(new Error("Le profil '"+uid+"' est introuvable"), null);
    }
    var defaultUserProfil = new UserProfil();
    defaultUserProfil.uid = user.uid;
    defaultUserProfil.user = user;
    defaultUserProfil.gamerTags = [];
    defaultUserProfil.save(function(err) {
      if (err) { return callback(err, null); }
      UserProfil.populate(defaultUserProfil, { path: 'user', select: '_key uid username picture gravatarpicture uploadedpicture status' }, function(err, userProfil) {
        if (err) { return callback(err, null); }
        console.log("UserProfil '"+userProfil.uid+"' successfully created");
        callback(null, userProfil);
      });
    });
  });
}

module.exports = router;