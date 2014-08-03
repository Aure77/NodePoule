var express = require('express');
var util = require('util');
var rest = require('restler');
var nconf = require('nconf');
var escape = require('escape-html');
var paginate = require('express-paginate');
var mongoose = require('mongoose'), Tournament = mongoose.model('Tournament');
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
		
		var participantsById = [];
		tournament.participants.forEach(function(participant) { // For tests
				participantsById[participant.pid] = participant;
		});
				
		var teams = [];
    var rounds = []; // List of rounds
		
		tournament.matchs.forEach(function(match) {
				if(match.round == 1) {
						teams.push([ participantsById[match.pid1], participantsById[match.pid2] ]);
				}
				var roundIndex = match.round-1;
				rounds[roundIndex] = rounds[roundIndex] || [];
				rounds[roundIndex].push([ match.score1, match.score2 ]);
		});
		res.render('tournament', { title: tournament.name, htitle: tournament.name, tournament: tournament, teams: teams, results: [ rounds ] });  
  });
});

router.get('/:id/participants', function(req, res, next) {
  var challongeUrl = util.format('https://api.challonge.com/v1/tournaments/%s/participants.json?api_key=%s', escape(req.params.id), nconf.get('challonge_api_key'));
  rest.json(challongeUrl, {timeout: 5000}).on('timeout', function(ms) {
    return next(new Error('Challonge did not return within ' + ms + ' ms'));
  }).on('complete',function(challongeParticipants, response) {
    var participants = [];
    challongeParticipants.forEach(function(chalParticipant) {
      participants.push({
        id: "challonge:" + chalParticipant.participant.id,
        pseudo: (chalParticipant.participant.username != null) ? chalParticipant.participant.username : chalParticipant.participant.name,
        avatarRelPath: util.format('http://www.gravatar.com/avatar/%s?r=r&s=200&d=http://nodepoule.eu/img/avatar.png', chalParticipant.participant.email_hash),
        nb1stPlace: 0,
        nb2ndPlace: 0,
        nb3rdPlace: 0
      });
    });
    res.render('participants', { title: "Participants", participants: participants });
  });
});

module.exports = router;