var express = require('express');
var escape = require('escape-html');
var paginate = require('express-paginate');
var mongoose = require('mongoose'), Game = mongoose.model('Game');
var router = express.Router();

router.get('/', function(req, res, next) {
	Game.find({},"_id name iconRelPath type").sort({type: 1}).exec(function(err, games){
		res.render('faq', { title: "FAQ", htitle: "La Foire Aux Questions!", games: games });
	});
});

module.exports = router;
