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
  }

};
