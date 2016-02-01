/**
 * HomeController
 *
 * @description :: Server-side logic for managing indices
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
   /**
   * `HomeController.index()`
   */
  index: function (req, res) {
    return res.view({title: "Accueil"});
  }
	
};

