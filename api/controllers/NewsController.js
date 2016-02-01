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
	detail : function (req, res, next) {
		var newsId = escape(req.params.id);
		News.findOneById(newsId).exec(function (err, news) {
			if (err) { return res.serverError(err);	}
			if (!news) {
				return next("La news '" + newsId + "' est introuvable");
			}
			
			return res.view({
				title : news.title,
				news : news
			});
		});
	}

};
