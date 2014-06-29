var express = require('express');
var router = express.Router();
var wowhead = require('wowhead')();

/* GET home page. */
router.get('/', function(req, res) {
  var cardName = req.param('q');
  wowhead.getCard(cardName, function(err, card) { 
    if(typeof card == 'undefined') {
        res.status(404).send('Not card found with name : ' + cardName);
    } else {
        console.log(card);
        res.render('index', { title: 'HearthStone', card: card });
    }
  });  
});

module.exports = router;
