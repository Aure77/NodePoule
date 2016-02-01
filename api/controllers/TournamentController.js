/**
 * TournamentController
 *
 * @description :: Server-side logic for managing tournaments
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
   /**
   * `TournamentController.index()`
   */
  index: function (req, res) {
    return res.view({title: "Tournois!"});
  }
	
};

