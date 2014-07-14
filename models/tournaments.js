var moment = require('moment');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');

/**
* Schemas definitions
*/
var RulesSchema = new Schema({
  title : String,
  description : String
});

var TournamentsSchema = new Schema({
  tournamentId : String,
  name : String,
  game : String,
  startDate : { type: Date, default: Date.now },
  endDate : { type: Date, default: Date.now },
  rules: [RulesSchema]
}, { collection: 'tournaments' });

TournamentsSchema.plugin(mongoosePaginate);

/**
* Custom Methods
*/
TournamentsSchema.virtual('title').get(function () {
  return this.name + ' - ' + moment(this.startDate).format('DD/MM/YYYY');
});

TournamentsSchema.virtual('prettyStartDate').get(function () {
  return moment(this.startDate).format('DD/MM/YYYY');
});

TournamentsSchema.virtual('prettyEndDate').get(function () {
  return moment(this.endDate).format('DD/MM/YYYY');
});

TournamentsSchema.set('toJSON', { virtuals: true });

/**
* Register schema
*/
mongoose.model('tournament', TournamentsSchema);