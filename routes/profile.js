var express = require('express');
var escape = require('escape-html');
var mongoose = require('mongoose'), UserProfil = mongoose.model('UserProfil'), User = mongoose.model('User');
var router = express.Router();

router.get('/', function(req, res, next) {
  try {
    findUserProfilById(req.user, function(userProfil) {
      res.render('profile', { profil: userProfil });
    });
  } catch(e) {
    next(new Error(e.message));
  }
});

router.get('/:id', function(req, res, next) {
  try {
    findUserProfilById(escape(req.params.id), function(userProfil) {
      res.render('profile', { profil: userProfil });
    });
  } catch(e) {
    next(new Error(e.message));
  }
});

var findUserProfilById = function(uid, callback) {
  UserProfil.findOne({ uid: uid })
            .populate('user', '_key uid username picture gravatarpicture uploadedpicture status')
            .populate('gamerTags.game')
            .lean()
            .exec(function(err, userProfil) {
    if(!userProfil) {
      //TODO if User model exist in objects collection(nodebb) -> create a new default profil
      throw("User '"+uid+"' not found");
    }    
    callback(userProfil);    
  });
}

module.exports = router;