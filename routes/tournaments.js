var express = require('express');
var escape = require('escape-html');
var router = express.Router();

/* GET tournaments page. */
router.get('/', function(req, res) {
  res.render('tournaments', { title: 'Listes des tournois', tournaments: {} });
});

router.get('/:id', function(req, res) {
  var tournament = { id : escape(req.params.id) };
  res.render('tournament', { title: 'Tournois', tournament: tournament });
});

module.exports = router;