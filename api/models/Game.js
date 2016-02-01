/**
 * Game.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	attributes : {
		name : {
			type : 'string',
			required : true,
			unique: true
		},
		description : {
			type : 'text',
			required : true
		},
		link : {
			type : 'string'
		},
		iconRelPath : {
			type : 'string'
		},
		type : {
			type : 'string',
			enum: ['game', 'platform'],
			required : true
		},
		topicId : {
			type : 'integer'
		},
		faqs : {
            collection: 'faq',
            via: 'game'
        },
		tournaments : {
            collection: 'tournament',
            via: 'game'
        }
	}
};
