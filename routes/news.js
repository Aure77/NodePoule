var express = require('express');
var escape = require('escape-html');
var paginate = require('express-paginate');
var mongoose = require('mongoose'), News = mongoose.model('News');
var router = express.Router();

router.use(paginate.middleware(8, 50));

/* GET news page. */
router.get('/', function(req, res, next) {
  var page = escape(req.query.page);
  var limit = escape(req.query.limit);
  News.paginate({}, { page: page, limit: limit }, function(err, newsCollection, pageCount, itemCount) {
    if (err) { return next(err); }
    res.render('all-news', { 
      title: 'Toutes les news', 
      htitle: 'Toutes les news', 
      newsCollection: newsCollection, 
      pageCount: pageCount,
      itemCount: itemCount
    });
  },
  {sortBy: '-date'});
});

router.get('/:id', function(req, res, next) {
  var newsId = escape(req.params.id);
  News.findOne({ newsId : newsId }).exec(function(err, news) {
    if (err) { return next(err); }    
    if(!news) {
      return next(new Error("La news '"+newsId+"' est introuvable"));
    }
    
    res.render('news', { title: news.title, news: news });
  });
});

module.exports = router;
