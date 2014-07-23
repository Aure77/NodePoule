var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
* Schemas definitions
*/
var GamerTagSchema = new Schema({
  game : { type: Schema.ObjectId, ref: 'Game' },
  tag : String
}, { _id: false });

var UserProfilSchema = new Schema({
  uid : { type: Number, require: true, unique: true, index: true },
  user : { type: Schema.ObjectId, ref: 'User' },
  gamerTags: [GamerTagSchema]
}, { collection: 'userprofils' });

/**
* Register schema
*/
mongoose.model('UserProfil', UserProfilSchema);