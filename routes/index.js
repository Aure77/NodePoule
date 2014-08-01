var express = require('express');
var mongoose = require('mongoose'), Tournament = mongoose.model('Tournament'), News = mongoose.model('News');
var router = express.Router();

router.get(['/', '/index.html'], function(req, res, next) {
  var today = new Date();
  Tournament.find({}).where('startDate').lte(today).where('endDate').gte(today).exec(function(err, tournaments) {
    if (err) { return next(err); }
    News.find({}).sort('-date').limit(8).exec(function(err2, newsCollection){
      if (err2) { return next(err2); }
      res.render('index', { 
        title: 'Accueil', 
        tournaments: tournaments,
        newsCollection : newsCollection
      });  
    });
  });
});

router.get('/contacts.html', function(req, res) {
  res.render('contacts', { title: 'Contactez-nous' });
});

module.exports = router;