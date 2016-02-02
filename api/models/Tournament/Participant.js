/**
 * Tournament/Participant.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
	identity : 'TournamentParticipant',
	attributes : {
		pid : {
			type : 'integer',
			required : true
		},
		name : { // Optional or for team name
			type : 'string'
		},
		excluded : {
			type : 'boolean',
			defaultsTo : false
		},
		tournament : {
			model : 'tournament'
		}
	}
};
