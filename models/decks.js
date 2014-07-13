var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
* Schemas definitions
*/
var CardsSchema = new Schema({
  cardId : String,
  quantity: Number
});

var DecksSchema = new Schema({
  deckId : Number,
  userId : Number,
  cards: [CardsSchema]
}, { collection: 'decks' });

/**
* Register schema
*/
mongoose.model('deck', DecksSchema);