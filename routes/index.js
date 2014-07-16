var express = require('express');
var router = express.Router();

router.get(['/', '/index.html'], function(req, res) {
  res.render('index', { title: 'Tournois en cours' });
});

router.get(['/contacts.html'], function(req, res) {
  res.render('index', { title: 'Contactez-nous' });
});

module.exports = router;