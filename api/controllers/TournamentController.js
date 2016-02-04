/**
 * TournamentController
 *
 * @description :: Server-side logic for managing tournaments
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

   /**
   * `TournamentController.all()`
   */
  all: function (req, res) {
    return res.view({title: "Tournois!"});
  },

  /**
  * `TournamentController.currentTournamentsJSON()`
  */
  currentTournamentsJSON: function (req, res) {
    // { populate: false, sort: 'startDate ASC', limit: 5, where: "{'startDate': {'>': '2016-04-04T10:57:08.976Z' }}" }
    var today = new Date();
    Tournament.find({'startDate': { '<=': today }, 'endDate': { '>=': today } }).sort('startDate ASC').limit(5).exec(function(err, tournaments) {
			if (err) { return res.serverError(err); }
			return res.json(tournaments);
    });
  },

  /**
  * `TournamentController.tournamentsPaginateJSON()`
  */
  tournamentsPaginateJSON: function (req, res) {
    var limit = req.param('limit', 5);
    var page = escape(req.params.page);
    Tournament.find().paginate({ page: page, limit: limit }).exec(function(err, tournaments) {
      if (err) { return res.serverError(err); }
      Tournament.count().exec(function(err, count) {
        if (err) return res.serverError(err);
        var contentRange = {
          start: (page-1) * limit,
          end: ((page-1) * limit) + limit,
          total: count
        };
        sails.log.silly('tournamentsPaginateJSON->Content-Range :: ' + contentRange.start + '-' + contentRange.end + '/' + contentRange.total);
        return res.json({tournaments: tournaments, contentRange: contentRange});
      });
    });
  }

};
