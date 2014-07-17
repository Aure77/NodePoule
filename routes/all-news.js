var express = require('express');
var escape = require('escape-html');
var paginate = require('express-paginate');
var mongoose = require('mongoose'), News = mongoose.model('News');
var router = express.Router();

router.use(paginate.middleware(8, 50));

/* GET news page. */
router.get('/', function(req, res, next) {
  News.paginate({}, escape(req.query.page), escape(req.query.limit), function(err, pageCount, news, itemCount) {
    if (err) { return next(err); }
    res.render('all-news', { 
      title: 'Toutes les news', 
      news: news, 
      pageCount: pageCount,
      itemCount: itemCount 
    });
  });
});

router.get('/:id', function(req, res, next) {
  News.findOne({ newsId : escape(req.params.id) }).exec(function(err, news) {
    if (err) { return next(err); }
    res.render('news', { title: news.title, news: news });
  });
});

module.exports = router;