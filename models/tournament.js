var moment = require('moment');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');

/**
* Schemas definitions
*/
var RuleSchema = new Schema({
  title : String,
  description : String
}, { _id: false });

var TournamentSchema = new Schema({
  tournamentId : { type: String, index: true },
  name : String,
  game : { type: Schema.ObjectId, ref: 'Game' },
  startDate : { type: Date, default: Date.now },
  endDate : { type: Date, default: Date.now },
  imageRelPath : String,
  rules: [RuleSchema]
}, { collection: 'tournaments' });

TournamentSchema.plugin(mongoosePaginate);

/**
* Custom Methods
*/
TournamentSchema.virtual('title').get(function () {
  return this.name + ' - ' + moment(this.startDate).format('DD/MM/YYYY');
});

TournamentSchema.virtual('prettyStartDate').get(function () {
  return moment(this.startDate).format('DD/MM/YYYY');
});

TournamentSchema.virtual('prettyEndDate').get(function () {
  return moment(this.endDate).format('DD/MM/YYYY');
});

TournamentSchema.set('toJSON', { virtuals: true });

/**
* Register schema
*/
mongoose.model('Tournament', TournamentSchema);