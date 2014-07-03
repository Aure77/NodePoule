var express = require('express');
var escape = require('escape-html');
var hearthstonejson = require('../modules/hearthstone-card-search');
var router = express.Router();

/*router.get('/', function(req, res) {
  hearthstonejson.findCardById(req.param.cardName, function(card) {
    res.render('index', { title: 'Listes des decks', card: {}});
  });
});*/

/* GET search by name */
router.get('/search/name/:cardName', function(req, res) {
  hearthstonejson.findCardByName(req.params.cardName, function(card) {
    res.render('hearthstone-decks', { title: 'Carte', card: card});
  });
});

/* GET search by id */
router.get('/search/id/:cardId', function(req, res) {
  hearthstonejson.findCardById(req.params.cardId, function(card) {
    console.log(card);
    res.render('hearthstone-decks', { title: 'Carte', card: card});
  });
});

module.exports = router;