/**
 * GameController
 *
 * @description :: Server-side logic for managing games
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  /**
   * `GameController.faq()`
   */
  faq : function (req, res) {
    Game.find().sort('type ASC').exec(function (err, games) {
      if (err) { return res.serverError(err);  }
      return res.view({
        title: "FAQ jeux",
        games : games
      });
    });
  },

  /**
   * `GameController.detail()`
   */
  detail : function (req, res) {
    var gameId = escape(req.params.id);
    Game.findOneById(gameId).populate("faqs", { sort: 'letter ASC' }).exec(function (err, game) {
      if (err) { return res.serverError(err);  }
      if (!game) {
        return res.notFound("Le jeu '"+gameId+"' est introuvable");
      }
      return res.view({
        title: "Jeu",
        htitle: "A propos de " + game.name,
        game : game
      });
    });
  }

};
