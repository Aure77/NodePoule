var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('faq', { title: "FAQ", htitle: "La Foire Aux Questions!" });
});

module.exports = router;
