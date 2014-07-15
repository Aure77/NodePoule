var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
* Schemas definitions
*/
var CardSchema = new Schema({
  cardId : String,
  quantity: Number
});

var DeckSchema = new Schema({
  userId : { type: Number, index: true },
  cards: [CardSchema]
}, { collection: 'decks' });

/**
* Register schema
*/
mongoose.model('Deck', DeckSchema);