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
});

/**
* Custom Methods
*/
DecksSchema.methods = {  
};

/**
* Register schema
*/
mongoose.model('decks', DecksSchema);