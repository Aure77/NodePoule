var express = require('express');
var router = express.Router();

router.get(['/', '/competitions.html'], function(req, res) {
  console.log("req.user="+req.user);
  res.render('competitions', { title: 'Comp�titions' });
});

module.exports = router;
