var express = require('express');
var mongoose = require('mongoose'), Tournament = mongoose.model('Tournament');
var router = express.Router();
var today = new Date();

router.get(['/', '/index.html'], function(req, res) {
  Tournament.find({ today:{$gte:'startDate', $lte:'endDate' }}, function(err, tournaments) {
    if (err) { return next(err); }
    res.render('index', { 
      title: 'Listes des tournois', 
      tournaments: tournaments
    });
  });
});

router.get(['/contacts.html'], function(req, res) {
  res.render('index', { title: 'Contactez-nous' });
});

module.exports = router;