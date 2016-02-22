/**
 * AuthController - Extends https://github.com/tjwebb/sails-auth/blob/master/api/controllers/AuthController.js
 *
 * @description :: Server-side logic for managing Auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 * @help        :: See https://github.com/tjwebb/sails-auth/blob/master/api/controllers/AuthController.js
 */
var _ = require('lodash');
var _super = require('sails-auth/api/controllers/AuthController');

_.merge(exports, _super);
_.merge(exports, {

  login: function(req, res) {
    res.view({ title: "Login" });
  },

  register: function(req, res) {
    res.view({ title: "Inscription" });
  }

});
