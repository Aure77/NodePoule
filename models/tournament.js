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

var MatchSchema = new Schema({
  pid1 : Number,
  pid2 : Number,
  score1 : Number,
  score2 : Number,
  eventDate : Date,
  round : Number
}, { _id: false });

var ParticipantSchema = new Schema({
  pid : Number,
  name : String /* Optional or for team name */
}, { _id: false });

var TournamentSchema = new Schema({
  tournamentId : { type: String, index: true, unique: true },
  name : String,
  game : { type: Schema.ObjectId, ref: 'Game' },
  startDate : { type: Date, default: Date.now },
  endDate : { type: Date, default: Date.now },
  imageRelPath : String,
  matchs: [MatchSchema],
  participants: [ParticipantSchema],
  rules: [RuleSchema],
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

TournamentSchema.virtual('status').get(function () {
    var today = new Date();
    today = moment(today).format('DD/MM/YYYY');
    var end = moment(this.endDate).format('DD/MM/YYYY');
    var start = moment(this.startDate).format('DD/MM/YYYY');
    if((+today <= +end) && (+today >= +start))
        return 'en cours';
    if(today < start)
        return 'à venir';
    if(today > end)
        return 'terminé';
});

TournamentSchema.virtual('cssStatus').get(function () {
    var today = new Date();
    today = moment(today).format('DD/MM/YYYY');
    var end = moment(this.endDate).format('DD/MM/YYYY');
    var start = moment(this.startDate).format('DD/MM/YYYY');
    if((+today <= +end) && (+today >= +start))
        return '.competition-statut.encours';
    if(today < start)
        return '.competition-statut.avenir';
    if(today > end)
        return '.competition-statut.termine';
});

TournamentSchema.set('toJSON', { virtuals: true });

/**
* Register schema
*/
mongoose.model('Tournament', TournamentSchema);