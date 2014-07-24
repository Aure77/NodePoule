var express = require('express');
var escape = require('escape-html');
var mongoose = require('mongoose'), UserProfil = mongoose.model('UserProfil'), User = mongoose.model('User');
var router = express.Router();

router.get('/', function(req, res, next) {
  findUserProfilById(req.user, function(err, userProfil) {
    if (err) { return next(err); }
    res.render('profile', { profil: userProfil });
  });
});

router.get('/:id', function(req, res, next) {
  findUserProfilById(escape(req.params.id), function(err, userProfil) {
    if (err) { return next(err); }
    res.render('profile', { profil: userProfil });
  });
});

function findUserProfilById(uid, callback) {
  UserProfil.findOne({ uid: uid })
            .populate('user', '_key uid username picture gravatarpicture uploadedpicture status')
            .populate('gamerTags.game')
            .lean()
            .exec(function(err, userProfil) {
    if(!userProfil) {
      //TODO if User model exist in objects collection(nodebb) -> create a new default profil
      callback(new Error("UserProfil '"+uid+"' not found"), null);
    }    
    callback(null, userProfil);    
  });
}

module.exports = router;