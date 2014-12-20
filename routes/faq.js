var express = require('express');
var escape = require('escape-html');
var paginate = require('express-paginate');
var mongoose = require('mongoose'), Games = mongoose.model('Games');
var router = express.Router();

router.get('/', function(req, res, next) {
	Games.find({},"name iconRelPath gameId").exec(function(err, games){
		res.render('faq', { title: "FAQ", htitle: "La Foire Aux Questions!", games: games });
	}
});

module.exports = router;
