/**
 * Tournament.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	attributes : {
		name : {
			type : 'string'
		},
		game : {
			model : 'game'
		},
		closedRegistrations : {
			type : 'boolean',
			defaultsTo : false
		},
		start 'datetime' : {
			type : 'datetime',
			defaultsTo : Date.now
		},
		end 'datetime' : {
			type : 'datetime',
			defaultsTo : Date.now
		},
		imageRelPath : 'string',
		topicId : 'string',
		matches : [MatchSchema],
		participants : [ParticipantSchema],
		rules : [RuleSchema],
	}
};
