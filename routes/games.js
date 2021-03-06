var express = require('express');
var escape = require('escape-html');
var paginate = require('express-paginate');
var mongoose = require('mongoose'), Game = mongoose.model('Game'), Tournament = mongoose.model('Tournament');
var router = express.Router();

router.use(paginate.middleware(4, 50));

router.get('/:id', function(req, res, next) {
  var gameId = escape(req.params.id);
	Game.findById(gameId).sort({"faq.letter": 1}).exec(function(err, game){
    if (err) { return next(err); }    
    if(!game) {
      return next(new Error("Le jeu '"+gameId+"' est introuvable"));
    }
		res.render('game', { title: "Jeu", htitle: "A propos de " + game.name, game: game });
	});
});

router.get('/:id/tournaments', function(req, res, next) {
    var gameId = escape(req.params.id);
    var page = escape(req.query.page);
    var limit = escape(req.query.limit);
    Tournament.paginate({"game._id" : gameId}, { page: page, limit: limit }, function(err, tournaments, pageCount, itemCount) {
    if (err) { return next(err); }
    res.render('tournaments', { 
      title: 'Tous les tournois', 
      htitle: 'Tous les tournois',
      tournaments: tournaments, 
      pageCount: pageCount,
      itemCount: itemCount 
    });
  });
});

module.exports = router;
