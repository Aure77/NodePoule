var express = require('express');
var mongoose = require('mongoose'), Tournament = mongoose.model('Tournament');
var router = express.Router();
var today = new Date();

router.get(['/', '/index.html'], function(req, res) {
  Tournament.find({ today:{$gte:'startDate', $lte:'endDate' }}, function(err, tournaments) {
    if (err) { return next(err); }
    res.render('tournaments', { 
      title: 'Listes des tournois', 
      tournaments: tournaments
    });
  });
  res.render('index', { title: 'Tournois en cours' });
});

router.get(['/contacts.html'], function(req, res) {
  res.render('index', { title: 'Contactez-nous' });
});

module.exports = router;