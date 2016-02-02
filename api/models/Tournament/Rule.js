/**
 * Tournament/Rule.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
	identity : 'TournamentRule',
	attributes : {
		title : {
			type : 'string',
			required : true
		},
		description : {
			type : 'string',
			required : true
		},
		tournament : {
			model : 'tournament'
		}
	}
};
