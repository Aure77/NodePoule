var winston = require('winston');
var _ = require('underscore');
var express = require('express');
var util = require('util');
var nconf = require('nconf');
var escape = require('escape-html');
var moment = require('moment');
var paginate = require('express-paginate');
var mongoose = require('mongoose'), Tournament = mongoose.model('Tournament'), User = mongoose.model('User');
var router = express.Router();

router.use(paginate.middleware(4, 50));

/* GET tournaments page. */
router.get('/', function(req, res, next) {
  var page = escape(req.query.page);
  var limit = escape(req.query.limit);
  winston.debug('Fetching all tournaments, page:%d, limit:%d', page, limit);
  Tournament.paginate({}, page, limit, function(err, pageCount, tournaments, itemCount) {
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
  winston.debug('Find tournament with tid: %s', tid);
  Tournament.findOne({ tournamentId : tid }).populate("game").exec(function(err, tournament) {
    if (err) { return next(err); }
    
    if(!tournament) {
      return next(new Error("Le tournoi '"+tid+"' est introuvable"));
    }

    var closedRegistrations = moment(tournament.startDate).isBefore(/*now*/) || tournament.closedRegistrations || isNaN(uid) || moment(tournament.endDate).isAfter(/*now*/) || /* || userIsRegistered*/;
    winston.info('closedRegistrations : %s', closedRegistrations);

    res.render('tournament', { title: tournament.name, htitle: tournament.name, tournament: tournament, closedRegistrations: closedRegistrations });
  });
});

router.get('/:id/join', function(req, res, next) {
  var tid = escape(req.params.id);
  Tournament.findOne({ tournamentId : tid }).lean().exec(function(err, tournament) {
    if (err) { return next(err); }
    
    if(!tournament) {
      return next(new Error("Le tournoi '"+tid+"' est introuvable"));
    }
    //TODO : Faire toutes les verifs qui vont bien (Date, etc)
	var uid = parseInt(res.locals.user);
	if(uid > 0) {
		Tournament.update({ tournamentId: tid }, { $addToSet: { participants: { pid : uid, name : null, /* team ? */ excluded : false	} }}, function (err, tnmt) {
			if (err) return next(err);
      winston.info('Registering user:%d to tournament:%s', uid, tid);
			res.json({ "msg": "OK", uid: uid });
		});
	} else {
    winston.info('Registering: User not found');
		res.status(401).json({ "error": "User not found" });
	}
  });
});

router.get('/:id/leave', function(req, res, next) {
  var tid = escape(req.params.id);
  Tournament.findOne({ tournamentId : tid }).lean().exec(function(err, tournament) {
    if (err) { return next(err); }
    
    if(!tournament) {
      return next(new Error("Le tournoi '"+tid+"' est introuvable"));
    }
    //TODO : Faire toutes les verifs qui vont bien (Date, etc)    
	var uid = parseInt(res.locals.user);
	if(uid > 0) {
		Tournament.update({ tournamentId: tid }, { $pull: { participants: { pid : uid } }}, function (err, tnmt) {
			if (err) return next(err);
      winston.info('Unregistering user:%d from tournament:%s', uid, tid);
			res.json({ "msg": "OK", uid: uid });
		});
	} else {
    winston.info('Unregistering: User not found');
		res.status(401).json({ "error": "User not found" });
	}
  });
});

router.get('/:id/participants', function(req, res, next) {
  var tid = escape(req.params.id);
  winston.info('Fetching all participants for tournament: %s', tid);
  Tournament.findOne({ tournamentId : tid }).exec(function(err, tournament) {
    if (err) { return next(err); }
    
    if(!tournament) {
      return next(new Error("Le tournoi '"+tid+"' est introuvable"));
    }

    var participantIds = [];
    tournament.participants.forEach(function(participant) {
       participantIds.push(participant.pid);      
    });
    winston.info('participants id found: ', participantIds);

    User.find({ 'uid' : { $in : participantIds }}, 'uid username picture').lean().exec(function(err, users) {
      if (err) { return next(err); }

      var participants = [];
      // Get user from participant id
      tournament.participants.forEach(function(participant) {
        var user = _.find(users, function (item) { return (item.uid === participant.pid && !participant.excluded); });
        if(user) {
          participants.push({uid: user.uid, name: user.username, picture: user.picture, nb1stPlace: 0, nb2ndPlace: 0, nb3rdPlace: 0 });
        }
      });

      var uid = parseInt(res.locals.user);
      var userIsRegistered = uid > 0 ? _.find(users, function (item) { return item.uid === uid; }) != null : false;
      winston.info('userIsRegistered : %s', userIsRegistered);
      var closedRegistrations = moment(tournament.startDate).isBefore(/*now*/) || tournament.closedRegistrations || isNaN(uid) /* || userIsRegistered*/;
      winston.info('closedRegistrations : %s', closedRegistrations);

      //res.render('participants', { title: "Participants", participants: participants }); // return html
      res.json({ participants: participants, userIsRegistered: userIsRegistered, closedRegistrations: closedRegistrations }); // return json
    });
  });
});

router.get('/:id/bracket', function(req, res, next) {
  var tid = escape(req.params.id);
  winston.debug('Find tournament with tid: %s', tid);
  Tournament.findOne({ tournamentId : tid }).exec(function(err, tournament) {
    if (err) { return next(err); }
    
    if(!tournament) {
      return next(new Error("Le tournoi '"+tid+"' est introuvable"));
    }
  
    var participantIds = [];
    tournament.participants.forEach(function(participant) {
       participantIds.push(participant.pid);      
    });
    winston.info('participants id found: ', participantIds);

    User.find({ 'uid' : { $in : participantIds }}, 'uid username picture').lean().exec(function(err, users) {
      if (err) { return next(err); }

      var participants = [];
      // Get user from participant id
      tournament.participants.forEach(function(participant) {
        var user = _.find(users, function (item) { return (item.uid === participant.pid && !participant.excluded); });
        if(user) {
          participants.push({uid: user.uid, name: user.username, picture: user.picture, nb1stPlace: 0, nb2ndPlace: 0, nb3rdPlace: 0 });
        }
      });

      var rounds = []; // List of rounds
      tournament.matches.forEach(function(match) {
        var roundIndex = match.round-1;
        rounds[roundIndex] = rounds[roundIndex] || [];
        var user1 = match.pid1 != null ? _.find(users, function (item) { return item.uid === match.pid1; }) : { uid: -1, name: '' };
        user1.score = match.score1;
        var user2 = match.pid2 != null ? _.find(users, function (item) { return item.uid === match.pid2; }) : { uid: -1, name: '' };
        user2.score = match.score2;
        rounds[roundIndex].push({ user1: user1, user2: user2, matchId: match.matchId, nextMatchId: match.nextMatchId });
      });
      winston.info('rounds nested objects : ', rounds);

      var uid = parseInt(res.locals.user);
      var userIsRegistered = uid > 0 ? _.find(users, function (item) { return item.uid === uid; }) != null : false;
      winston.info('userIsRegistered : %s', userIsRegistered);
      var closedRegistrations = moment(tournament.startDate).isBefore(/*now*/) || tournament.closedRegistrations || isNaN(uid) /* || userIsRegistered*/;
      winston.info('closedRegistrations : %s', closedRegistrations);

      res.json({ matches: tournament.matches, rounds: rounds, participants: participants, userIsRegistered: userIsRegistered, closedRegistrations: closedRegistrations });
    });
  });
});

module.exports = router;