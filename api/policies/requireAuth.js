/**
 * requireAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to redirect anonymous user to login page
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */
module.exports = function requireAuth(req, res, next) {

	// User is logged in, proceed to the next policy,
	// or if this is the last policy, the controller
	if (res.locals.user) {
		return next();
	}

	// User is not logged in -> redirect
	console.log(req.headers);
	if (req.xhr || req.headers.accept.indexOf('json') > -1) { // requete ajax
		//TODO gérer nconf
		var redirectUrl = "/loginJsonTODO";
		//var redirectUrl = util.format("%s/login?next=%s", nconf.get("forum_url"), req.headers.referer);
		console.log("[xhr] redirect to " + redirectUrl);
		return res.redirect(401, redirectUrl); // 401 for ajax ?
	} else {
		//TODO gérer nconf
		var redirectUrl = "/loginTODO";
		//var redirectUrl = util.format("%s/login?next=%s%s", nconf.get("forum_url"), nconf.get("base_url"), req.originalUrl);
		console.log("redirect to " + redirectUrl);
		return res.redirect(redirectUrl); // 302
	}
	// (default res.forbidden() behavior can be overridden in `config/403.js`)
	//return res.forbidden('You are not permitted to perform this action.');
};