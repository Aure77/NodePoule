/**
 * Tournament/Match.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
	identity : 'TournamentMatch',
	attributes : {
		matchId : {
			type : 'integer',
			required : true
		},
		nextMatchId : {
			type : 'integer',
			required : true
		},
		pid1 : {
			type : 'integer'
		},
		pid2 : {
			type : 'integer'
		},
		score1 : {
			type : 'integer'
		},
		score2 : {
			type : 'integer'
		},
		eventDate : {
			type : 'datetime'
		},
		round : {
			type : 'integer',
			required : true
		},
		tournament : {
			model : 'tournament'
		}
	}
};
