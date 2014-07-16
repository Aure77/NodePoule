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
  uid : { type: Number, index: true },
  skype : String,
  gamerTags: [GamerTagSchema]
}, { collection: 'userprofils' });

/**
* Register schema
*/
mongoose.model('UserProfil', UserProfilSchema);