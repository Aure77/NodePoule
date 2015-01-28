var express = require('express');
var escape = require('escape-html');
var paginate = require('express-paginate');
var mongoose = require('mongoose'), Game = mongoose.model('Game');
var router = express.Router();

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

module.exports = router;
