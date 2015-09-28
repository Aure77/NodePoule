var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

/**
* Schemas definitions
*/
var UserSchema = new Schema({
  "_key" : String,
  "uid" : Number,
  "username" : String,
  "userslug" : String,
  "fullname" : String,
  "location" : String,
  "birthday" : String,
  "website" : String,
  "email" : String,
  "signature" : String,
  "joindate" : Number,
  "picture" : String,
  "gravatarpicture" : String,
  "uploadedpicture" : String,
  "profileviews" : Number,
  "reputation" : Number,
  "postcount" : Number,
  "lastposttime" : Number,
  "banned" : Number,
  "status" : String,
  "password" : String,
  "lastonline" : Number
}, { collection: 'objects' });

UserSchema.plugin(passportLocalMongoose, { usernameField: 'uid', selectFields: 'uid username userslug fullname location birthday birthday website email signature joindate picture gravatarpicture uploadedpicture profileviews reputation postcount lastposttime banned status lastonline' });

/**
* Register schema
*/
mongoose.model('User', UserSchema);