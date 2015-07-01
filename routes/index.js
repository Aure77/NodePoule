var express = require('express');
var paginate = require('express-paginate');
var mongoose = require('mongoose'), Tournament = mongoose.model('Tournament'), News = mongoose.model('News');
var router = express.Router();

router.use(paginate.middleware(8, 50));

router.get(['/', '/index.html'], function(req, res, next) {
  var page = escape(req.query.page);
  var limit = escape(req.query.limit);
  var today = new Date();
  Tournament.find({}).where('startDate').lte(today).where('endDate').gte(today).exec(function(err, tournaments) {
    if (err) { return next(err); }
    News.paginate({}, page, limit, function(err2, pageCount, newsCollection, itemCount) {
      if (err2) { return next(err2); }
      res.render('index', { 
        title: 'Accueil',
        tournaments: tournaments,
        newsCollection : newsCollection,
        pageCount: pageCount,
        itemCount: itemCount
      });
    },
    {sortBy: '-date'});
  });
});

router.get('/contacts.html', function(req, res) {
  res.render('contacts', { title: 'Contactez-nous' });
});

module.exports = router;