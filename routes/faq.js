var express = require('express');
var router = express.Router();

router.get('/:', function(req, res, next) {
    res.render('faq', { title: "La Foire Aux Questions!" });
});

module.exports = router;