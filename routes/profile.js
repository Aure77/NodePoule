var express = require('express');
var escape = require('escape-html');
var mongoose = require('mongoose'), UserProfil = mongoose.model('UserProfil'), User = mongoose.model('User');
var router = express.Router();

router.get('/:id', function(req, res, next) {
  UserProfil.findOne({ uid: escape(req.params.id) })
            .populate('user', '_key uid username picture gravatarpicture uploadedpicture status')
            .populate('gamerTags.game')
            .lean()
            .exec(function(err, userProfil) {
    if(!userProfil) {
      //TODO if User model exist in objects collection(nodebb) -> create a new default profil
      next(new Error("User '"+escape(req.params.id)+"' not found"));
    }
    res.render('profile', { profil: userProfil });
  });
});

module.exports = router;