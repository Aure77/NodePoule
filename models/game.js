var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
* Schemas definitions
*/
var GameSchema = new Schema({
  name : { type: String, index: true },
  link : String,
  iconRelPath : String
}, { collection: 'games' });

/**
* Register schema
*/
mongoose.model('Game', GameSchema);