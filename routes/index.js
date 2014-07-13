var express = require('express');
var router = express.Router();
//var mongoose = require('mongoose'), Deck = mongoose.model('deck');

router.get(['/', '/index.html'], function(req, res) {
  console.log("req.user="+req.user);
  /*var monDeck = new Deck({
    deckId : 1,
    userId : req.user
  });
  monDeck.cards.push({
    cardId : "CS2_155",
    quantity: 1
  });
  monDeck.cards.push({
    cardId : "CS2_131",
    quantity: 2
  });
  monDeck.save(function (err) {
    if (err) { throw err; }
    console.log('Deck ajouté avec succès !');
  });*/
  res.render('index', { title: 'Tournois en cours' });
});

module.exports = router;
