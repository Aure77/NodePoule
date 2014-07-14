var express = require('express');
var escape = require('escape-html');
var paginate = require('express-paginate');
var mongoose = require('mongoose'), Tournament = mongoose.model('tournament');
var router = express.Router();

router.use(paginate.middleware(4, 50));

/* GET tournaments page. */
router.get('/', function(req, res, next) {
  Tournament.paginate({}, escape(req.query.page), escape(req.query.limit), function(err, pageCount, tournaments, itemCount) {
    if (err) { return next(err); }
    res.render('tournaments', { 
      title: 'Listes des tournois', 
      tournaments: tournaments, 
      pageCount: pageCount,
      itemCount: itemCount 
    });
  });
});

router.get('/:id', function(req, res, next) {
  Tournament.findOne({ tournamentId : escape(req.params.id) }, function(err, tournament) {
    if (err) { return next(err); }
    res.render('tournament', { title: tournament.title, tournament: tournament });
  });
});

module.exports = router;