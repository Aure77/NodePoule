var path = require('path');
var fs = require('fs');
var removeDiacritics = require('diacritics').remove;

/* private */
var readCardsFromFile = function(callback) {
    fs.readFile(path.resolve(__dirname, 'AllSets.frFR.json'), 'utf8', function (err,data) {
        if (err) {
            return console.log(err);
        }
        json = JSON.parse(data);
        var cards = [];
        for (var cat in json) {
            cards = cards.concat(json[cat]);
        }
        if(typeof callback === 'function') {
            callback(cards);
        }
    });
};

/* public */
var hearthstonejson = { 
    findAllCards: function(callback) {
        readCardsFromFile(callback);
    },
    findCardById: function(id, callback) {
        if(typeof id === 'undefined') {
            return console.log('card id is undefined');
        }
        readCardsFromFile(function(jsonCards) {
            var filteredJsonCards = jsonCards.filter(function(card) {
                return card.id == id;
            });
            if(typeof callback === 'function') {
                var result = null;
                if(filteredJsonCards.length > 0) {
                    result = filteredJsonCards[0]; // only one result
                }
                callback(result);
            }
        });
    },
    findCardByName: function(name, callback) {
        if(typeof name === 'undefined') {
            return console.log('card name is undefined');
        }
        readCardsFromFile(function(jsonCards) {
            try {
                var regexp = new RegExp(removeDiacritics(name), "i");
                var filteredJsonCards = jsonCards.filter(function(card) {    
                    return regexp.test(removeDiacritics(card.name));
                });
            } catch(e) {
                console.log(e);
            }
            if(typeof callback === 'function') {
                var result = null;
                if(filteredJsonCards.length > 0) {
                    result = filteredJsonCards[0]; // only one result
                }
                callback(result);
            }
        });
    }
};

module.exports = hearthstonejson;