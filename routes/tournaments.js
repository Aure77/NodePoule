var _ = require('underscore');
var express = require('express');
var util = require('util');
var nconf = require('nconf');
var escape = require('escape-html');
var paginate = require('express-paginate');
var mongoose = require('mongoose'), Tournament = mongoose.model('Tournament'), User = mongoose.model('User');
var router = express.Router();

router.use(paginate.middleware(4, 50));

/* GET tournaments page. */
router.get('/', function(req, res, next) {
  Tournament.paginate({}, escape(req.query.page), escape(req.query.limit), function(err, pageCount, tournaments, itemCount) {
    if (err) { return next(err); }
    res.render('tournaments', { 
      title: 'Tous les tournois', 
      htitle: 'Tous les tournois',
      tournaments: tournaments, 
      pageCount: pageCount,
      itemCount: itemCount 
    });
  });
});

router.get('/:id', function(req, res, next) {
  var tid = escape(req.params.id);
  Tournament.findOne({ tournamentId : tid }).populate("game").exec(function(err, tournament) {
    if (err) { return next(err); }
    
    if(!tournament) {
      return next(new Error("Le tournoi '"+tid+"' est introuvable"));
    }

    // Get all existing users
    User.find({}, 'uid username picture').lean().exec(function(err, users) {
      if (err) { return next(err); }

      var participants = [];
      // Get user from participant id
      tournament.participants.forEach(function(participant) {
        var user = _.find(users, function (item) { return item.uid === participant.pid; });
        if(user) {
          participants.push({uid: user.uid, name: user.username, picture: user.picture });
        }
      });

      var rounds = []; // List of rounds
      tournament.matches.forEach(function(match) {
        var roundIndex = match.round-1;
        rounds[roundIndex] = rounds[roundIndex] || [];
        var user1 = match.pid1 != null ? _.find(participants, function (item) { return item.uid === match.pid1; }) : { uid: -1, name: '' };
        var user2 = match.pid2 != null ? _.find(participants, function (item) { return item.uid === match.pid2; }) : { uid: -1, name: '' };
        rounds[roundIndex].push({ user1: user1, user2: user2, score1: match.score1, score2: match.score2, matchId: match.matchId, nextMatchId: match.nextMatchId });
      });
      res.render('tournament', { title: tournament.name, htitle: tournament.name, tournament: tournament, participants: participants, rounds: rounds });

    });
  });
});

router.get('/:id/participants', function(req, res, next) {
  var tid = escape(req.params.id);
  Tournament.findOne({ tournamentId : tid }).exec(function(err, tournament) {
    if (err) { return next(err); }
    
    if(!tournament) {
      return next(new Error("Le tournoi '"+tid+"' est introuvable"));
    }

    // Get all existing users
    User.find({}, 'uid username picture').lean().exec(function(err, users) {
      if (err) { return next(err); }

      var participants = [];
      // Get user from participant id
      tournament.participants.forEach(function(participant) {
        var user = _.find(users, function (item) { return item.uid === participant.pid; });
        if(user) {
          participants.push({uid: user.uid, name: user.username, picture: user.picture, nb1stPlace: 0, nb2ndPlace: 0, nb3rdPlace: 0 });
        }
      });

      res.render('participants', { title: "Participants", participants: participants });
    });
  });
});

module.exports = router;