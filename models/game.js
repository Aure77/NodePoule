var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
* Schemas definitions
*/
var QuestionSchema = new Schema({
  letter : String, // A-Z#
  title : String,
  content : String
}, { _id: false });

var GameSchema = new Schema({
  gameId : String,
  name : { type: String, index: true },
  description : String,
  link : String,
  iconRelPath : String,
  faq : [QuestionSchema]
}, { collection: 'games' });

/**
* Register schema
*/
mongoose.model('Game', GameSchema);