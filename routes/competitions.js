var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('competitions', { title: 'Comp�titions', competitions:[] });
});

module.exports = router;
