/**
 * Tournament/Tournament.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */
var moment = require('moment');

module.exports = {
	identity : 'Tournament',
	attributes : {
		name : {
			type : 'string',
			required : true
		},
		game : {
			model : 'game'
		},
		closedRegistrations : {
			type : 'boolean',
			defaultsTo : false
		},
		startDate : {
			type : 'datetime',
			defaultsTo : function () {
				return new Date();
			}
		},
		endDate : {
			type : 'datetime',
			defaultsTo : function () {
				return new Date();
			}
		},
		imageRelPath : 'string',
		topicId : 'string',
		matches : {
			collection : 'TournamentMatch',
			via : 'tournament'
		},
		// Associations (aka relational attributes)
		participants : {
			collection : 'TournamentParticipant',
			via : 'tournament'
		},
		rules : {
			collection : 'TournamentRule',
			via : 'tournament'
		},
		// Attribute methods
		//TODO déplacer la logique dans la view
		getTitle : function () {
			return this.name + ' - ' + moment(this.startDate).format('DD/MM/YYYY');
		},
		//TODO déplacer la logique dans la view
		getPrettyStartDate : function () {
			return moment(this.startDate).format('DD/MM/YYYY');
		},
		//TODO déplacer la logique dans la view
		getPrettyEndDate : function () {
			return moment(this.endDate).format('DD/MM/YYYY');
		},
		//TODO déplacer la logique dans la view
		getStatus : function () {
			var today = moment();
			var end = moment(this.endDate);
			var start = moment(this.startDate);
			if ((today <= end) && (today >= start))
				return 'en cours';
			if (today < start)
				return 'a venir';
			if (today > end)
				return 'termine';
		},
		//TODO déplacer la logique dans la view
		getCssStatus : function () {
			var today = moment();
			var end = moment(this.endDate);
			var start = moment(this.startDate);
			if ((today <= end) && (today >= start))
				return 'competition-statut encours';
			if (today < start)
				return 'competition-statut avenir';
			if (today > end)
				return 'competition-statut termine';
		}
	}
};
