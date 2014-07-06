var express = require('express');
var escape = require('escape-html');
var hearthstonejson = require('../modules/hearthstone-card-search');
var router = express.Router();

router.get('/', function(req, res) {
  hearthstonejson.findAllCards(function(cards) {
    console.log("cards="+cards.length);
    res.render('hearthstone-decks', { title: 'Création de decks', cards: cards});
  });
});

module.exports = router;