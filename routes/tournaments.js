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
router.get('/', function (req, res, next) {
  var page = escape(req.query.page);
  var limit = escape(req.query.limit);
  winston.debug('Fetching all tournaments, page:%d, limit:%d', page, limit);
  Tournament.paginate({}, { page: page, limit: limit }, function (err, tournaments, pageCount, itemCount) {
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

function isTournamentRegistrationsClosed(tournament, uid) {
  var isTournamentRegistrationsClosed = tournament.closedRegistrations || isNaN(uid) || moment(tournament.startDate).isBefore(/*now*/) /*|| moment(tournament.endDate).isAfter(/*now*//*) || userIsRegistered*/;
  winston.debug('tournament.closedRegistrations=%s || isNaN(uid)=%s || moment(tournament.startDate).isBefore(/*now*/)=%s', tournament.closedRegistrations, isNaN(uid), moment(tournament.startDate).isBefore(/*now*/));
  winston.info('Tournament "%s" registrations closed : %s', tournament.tournamentId, isTournamentRegistrationsClosed);
  return isTournamentRegistrationsClosed;
}

function isUserHasJoinTournament(registeredUsers, uid) {
  var userHasJoinTournament = uid > 0 ? _.find(registeredUsers, function (item) { return item.uid === uid; }) != null : false;
  winston.info('userHasJoinTournament : %s', userHasJoinTournament);
  return userHasJoinTournament;
}

router.get('/:id', function (req, res, next) {
  var tid = escape(req.params.id);
  winston.debug('Find tournament with tid: %s', tid);
  Tournament.findOne({ tournamentId: tid }).populate("game").exec(function (err, tournament) {
    if (err) { return next(err); }

    if (!tournament) {
      return next(new Error("Le tournoi '" + tid + "' est introuvable"));
    }

    var uid = parseInt(res.locals.user);
    var closedRegistrations = isTournamentRegistrationsClosed(tournament, uid);

    res.render('tournament', { title: tournament.name, htitle: tournament.name, tournament: tournament, closedRegistrations: closedRegistrations });
  });
});

router.get('/:id/join', function (req, res, next) {
  var tid = escape(req.params.id);
  Tournament.findOne({ tournamentId: tid }).lean().exec(function (err, tournament) {
    if (err) { return next(err); }

    if (!tournament) {
      return next(new Error("Le tournoi '" + tid + "' est introuvable"));
    }
    //TODO : Faire toutes les verifs qui vont bien (Date, etc)
    var uid = parseInt(res.locals.user);
    var closedRegistrations = isTournamentRegistrationsClosed(tournament, uid);
    if (uid > 0) {
      Tournament.update({ tournamentId: tid }, { $addToSet: { participants: { pid: uid, name: null, /* team ? */ excluded: false } } }, function (err, tnmt) {
        if (err) return next(err);
        winston.info('Registering user:%d to tournament:%s', uid, tid);
        res.json({ "msg": "OK", uid: uid });
      });
    } else if(closedRegistrations) {
      winston.warn('Registering: Tournament registrations closed !');
      res.status(403).json({ "error": "Tournament registrations closed !" });
    } else {
      winston.info('Registering: User not found');
      res.status(401).json({ "error": "User not found" });
    }
  });
});

router.get('/:id/leave', function (req, res, next) {
  var tid = escape(req.params.id);
  Tournament.findOne({ tournamentId: tid }).lean().exec(function (err, tournament) {
    if (err) { return next(err); }

    if (!tournament) {
      return next(new Error("Le tournoi '" + tid + "' est introuvable"));
    }
    //TODO : Faire toutes les verifs qui vont bien (Date, etc)    
    var uid = parseInt(res.locals.user);
    var closedRegistrations = isTournamentRegistrationsClosed(tournament, uid);
    if (uid > 0 && !closedRegistrations) {
      Tournament.update({ tournamentId: tid }, { $pull: { participants: { pid: uid } } }, function (err, tnmt) {
        if (err) return next(err);
        winston.info('Unregistering user:%d from tournament:%s', uid, tid);
        res.json({ "msg": "OK", uid: uid });
      });
    } else if(closedRegistrations) {
      winston.warn('Unregistering: Tournament registrations closed !');
      res.status(403).json({ "error": "Tournament registrations closed !" });
    } else {
      winston.info('Unregistering: User not found');
      res.status(401).json({ "error": "User not found" });
    }
  });
});

router.get('/:id/participants', function (req, res, next) {
  var tid = escape(req.params.id);
  winston.info('Fetching all participants for tournament: %s', tid);
  Tournament.findOne({ tournamentId: tid }).exec(function (err, tournament) {
    if (err) { return next(err); }

    if (!tournament) {
      return next(new Error("Le tournoi '" + tid + "' est introuvable"));
    }

    var participantIds = [];
    tournament.participants.forEach(function (participant) {
      participantIds.push(participant.pid);
    });
    winston.info('participants id found: ', participantIds);

    User.find({ 'uid': { $in: participantIds } }, 'uid username picture').lean().exec(function (err, users) {
      if (err) { return next(err); }

      var participants = [];
      // Get user from participant id
      tournament.participants.forEach(function (participant) {
        var user = _.find(users, function (item) { return (item.uid === participant.pid && !participant.excluded); });
        if (user) {
          participants.push({ uid: user.uid, name: user.username, picture: user.picture, nb1stPlace: 0, nb2ndPlace: 0, nb3rdPlace: 0 });
        }
      });

      var uid = parseInt(res.locals.user);
      var userHasJoinTournament = isUserHasJoinTournament(users, uid);
      var closedRegistrations = isTournamentRegistrationsClosed(tournament, uid);

      //res.render('participants', { title: "Participants", participants: participants }); // return html
      res.json({ participants: participants, userHasJoinTournament: userHasJoinTournament, closedRegistrations: closedRegistrations }); // return json
    });
  });
});

router.get('/:id/bracket', function (req, res, next) {
  var tid = escape(req.params.id);
  winston.debug('Find tournament with tid: %s', tid);
  Tournament.findOne({ tournamentId: tid }).lean().exec(function (err, tournament) {
    if (err) { return next(err); }

    if (!tournament) {
      return next(new Error("Le tournoi '" + tid + "' est introuvable"));
    }

    var participantIds = [];
    tournament.participants.forEach(function (participant) {
      participantIds.push(participant.pid);
    });
    winston.info('participants id found: ', participantIds);

    User.find({ 'uid': { $in: participantIds } }, 'uid username picture').lean().exec(function (err, users) {
      if (err) { return next(err); }

      var participants = [];
      // Get user from participant id
      tournament.participants.forEach(function (participant) {
        var user = _.find(users, function (item) { return (item.uid === participant.pid && !participant.excluded); });
        if (user) {
          participants.push({ uid: user.uid, name: user.username, picture: user.picture, nb1stPlace: 0, nb2ndPlace: 0, nb3rdPlace: 0 });
        }
      });

      var rounds = []; // List of rounds
      tournament.matches.forEach(function (match) {
        var roundIndex = match.round - 1;
        rounds[roundIndex] = rounds[roundIndex] || [];
        // find user1 informations
        var _user1 = match.pid1 != null ? _.find(users, function (item) { return item.uid === match.pid1; }) : null;
        var user1 = _user1 != null ? { uid: _user1.uid, username: _user1.username, picture: _user1.picture, score: match.score1 } : { uid: -1, username: '', picture: '', score: null };
        // find user2 informations
        var _user2 = match.pid2 != null ? _.find(users, function (item) { return item.uid === match.pid2; }) : null;
        var user2 = _user2 != null ? { uid: _user2.uid, username: _user2.username, picture: _user2.picture, score: match.score2 } : { uid: -1, username: '', picture: '', score: null };
        // Add round inforamtions
        rounds[roundIndex].push({ user1: user1, user2: user2, matchId: match.matchId, nextMatchId: match.nextMatchId });
      });
      winston.info('rounds nested objects : ', rounds);

      var uid = parseInt(res.locals.user);
      var userHasJoinTournament = isUserHasJoinTournament(users, uid);
      var closedRegistrations = isTournamentRegistrationsClosed(tournament, uid);

      res.json({ matches: tournament.matches, rounds: rounds, participants: participants, userHasJoinTournament: userHasJoinTournament, closedRegistrations: closedRegistrations });
    });
  });
});

module.exports = router;