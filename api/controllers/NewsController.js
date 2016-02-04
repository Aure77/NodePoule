/**
 * NewsController
 *
 * @description :: Server-side logic for managing news
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  /**
   * `NewsController.detail()`
   */
  detail : function (req, res) {
    var newsId = escape(req.params.id);
    News.findOneById(newsId).exec(function (err, news) {
      if (err) { return res.serverError(err);  }
      if (!news) {
        return res.notFound("La news '" + newsId + "' est introuvable");
      }

      return res.view({
        title : news.title,
        news : news
      });
    });
  },

  /**
  * `NewsController.newsPaginateJSON()`
  */
  newsPaginateJSON: function (req, res) {
    var limit = req.param('limit', 3);
    var page = escape(req.params.page);
    News.find().paginate({ page: page, limit: limit }).exec(function(err, newsCollection) {
      if (err) { return res.serverError(err); }
      News.count().exec(function(err, count) {
  			if (err) return res.serverError(err);
  			var contentRange = {
  				start: (page-1) * limit,
  				end: ((page-1) * limit) + limit,
  				total: count
  			};
  			sails.log.silly('newsPaginateJSON->Content-Range :: ' + contentRange.start + '-' + contentRange.end + '/' + contentRange.total);
  			return res.json({newsCollection: newsCollection, contentRange: contentRange});
  		});
    });
  }

};
