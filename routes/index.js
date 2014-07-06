var express = require('express');
var router = express.Router();

router.get(['/', '/index.html'], function(req, res) {
  res.render('index', { title: 'Derniers tournois' });
});

module.exports = router;
