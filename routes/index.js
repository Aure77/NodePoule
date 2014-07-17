var express = require('express');
var mongoose = require('mongoose'), Tournament = mongoose.model('Tournament'), News = mongoose.model('News');
var router = express.Router();
var today = new Date();

router.get(['/', '/index.html'], function(req, res, next) {
  var tournaments = [], news = [];
  Tournament.find({}).where('startDate').lte(today).where('endDate').gte(today).exec(function(err, tournamentResults) {
    if (err) { return next(err); }
    tournaments = tournamentResults;
  });
  News.find({}).sort('date').limit(8).exec(function(err, newsResult){
    if (err) { return next(err); }
    news = newsResult;
  });
  res.render('index', { 
    title: 'Accueil', 
    tournaments: tournaments,
    newscollection : news
  });  
});

router.get('/contacts.html', function(req, res) {
  res.render('contacts', { title: 'Contactez-nous' });
});

module.exports = router;