/**
 * AuthController - Extends https://github.com/tjwebb/sails-auth/blob/master/api/controllers/AuthController.js
 *
 * @description :: Server-side logic for managing Auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 * @help        :: See https://github.com/tjwebb/sails-auth/blob/master/api/controllers/AuthController.js
 */
module.exports = {

  login: function(req, res) {
    res.view({ title: "Login" });
  }

};
