/**
 * Faq.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	attributes : {
		letter : { // A-Z#
			type : 'string',
			required : true,
			unique: true
		},
		title : {
			type : 'string',
			required : true
		},
		content : {
			type : 'string',
			required : true
		},
		game : { model: 'game' }
	}
	
};
