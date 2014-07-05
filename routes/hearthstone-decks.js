var express = require('express');
var escape = require('escape-html');
var hearthstonejson = require('../modules/hearthstone-card-search');
var router = express.Router();

router.get('/', function(req, res) {
  hearthstonejson.findAllCards(function(cards) {
    console.log("cards="+cards.length);
    var d = [];
    for(i=0;i<6;i++) {
        d.push({id: i, name: "Test"+i});
    }
    res.render('hearthstone-decks', { title: 'Cartes', cards: cards});
  });
});

/* GET search by name */
router.get('/search/name/:cardName', function(req, res) {
  hearthstonejson.findCardByName(req.params.cardName, function(card) {
    console.log(card);
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