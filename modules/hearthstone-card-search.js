var path = require('path');
var fs = require('fs');
var jsonQuery = require('json-query');

/* private */
var findCardByPredicate = function(predicate, callback) {
    fs.readFile(path.resolve(__dirname, 'AllSets.frFR.json'), 'utf8', function (err,data) {
        if (err) {
            return console.log(err);
        }
        json = JSON.parse(data);    
        
        //TODO test filtre
        var filters = {
          contains: function(input, params){
            console.log("%j => %j", input, params.args[0]);
            if(params.args[0] == "abc") {
                return input;
            } else {
                return false;
            }
          }
        };
        
        callback(jsonQuery(predicate, { rootContext: json, filters: filters }).value);
    });
};

/* public */
var hearthstonejson = { 
    findCardById: function(id, callback) {
        if(typeof id === 'undefined') {
            return console.log('card id is undefined');
        }
        findCardByPredicate(['[][id=?]', id], callback);
    },
    findCardByName: function(name, callback) {
        if(typeof name === 'undefined') {
            return console.log('card name is undefined');
        }
        //TODO predicat
        findCardByPredicate(['[].name', name], callback);
    }
};

module.exports = hearthstonejson;