/**
 * News.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	attributes : {

		/*newsId : {
			type : 'number',
			primaryKey : true,
			autoIncrement: true // ne fonctionne pas sur mongo
		},*/

		title : {
			type : 'string',
			required: true
		},

		content : {
			type : 'text',
			required: true
		},

		date : {
			type : 'datetime'
		},

		hideThumbnail : {
			type : 'boolean',
			defaultsTo: false
		},

		thumbnailRelPath : {
			type : 'string'
		}
	}
};
