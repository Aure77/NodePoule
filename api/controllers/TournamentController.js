/**
 * TournamentController
 *
 * @description :: Server-side logic for managing tournaments
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

   /**
   * `TournamentController.all()`
   */
  all: function (req, res) {
    return res.view({title: 'Tous les tournois'});
  },

  /**
  * `TournamentController.detail()`
  */
  detail: function (req, res) {
    var tid = escape(req.params.id);
    sails.log.debug('Find tournament with tid: %s', tid);
    Tournament.findOneById(tid).populate("game").exec(function(err, tournament) {
      if (err) { return res.serverError(err); }
      if (!tournament) {
        return res.notFound("Le tournoi '" + tid + "' est introuvable");
      }
      var uid = req.uid;
      var closedRegistrations = TournamentService.isTournamentRegistrationsClosed(tournament, uid);

      res.view({
        title: tournament.name,
        htitle: tournament.name,
        tournament: tournament,
        closedRegistrations: closedRegistrations
      });
    });
  },

  /**
  * `TournamentController.getTournamentParticipantsJSON()`
  */
  getTournamentBracketJSON: function (req, res) {
    var tid = escape(req.params.id);
    sails.log.debug('Find tournament with tid: ', tid);
    Tournament.findOneById(tid).exec(function (err, tournament) {
      if (err) { return res.serverError(err); }

      if (!tournament) {
        return res.notFound("Le tournoi '" + tid + "' est introuvable");
      }

      var participantIds = [];
      tournament.participants.forEach(function (participant) {
        participantIds.push(participant.pid);
      });
      sails.log.silly('participants id found: ', participantIds);

      //TODO user find
      res.json({ matches: tournament.matches, rounds: [], participants: tournament.participants, userHasJoinTournament: false, closedRegistrations: false });
      /*User.find({ 'uid': { $in: participantIds } }, 'uid username picture').lean().exec(function (err, users) {
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
        logger.info('rounds nested objects : ', rounds);

        var uid = req.uid;
        var userHasJoinTournament = isUserHasJoinTournament(users, uid);
        var closedRegistrations = isTournamentRegistrationsClosed(tournament, uid);

        res.json({ matches: tournament.matches, rounds: rounds, participants: participants, userHasJoinTournament: userHasJoinTournament, closedRegistrations: closedRegistrations });
      });*/
    });
  },

  joinTournamentJSON: function(req, res) {
    var tid = escape(req.params.id);

      //TODO : Faire toutes les verifs qui vont bien (Date, etc)
      /*var uid = req.uid;
      var closedRegistrations = isTournamentRegistrationsClosed(tournament, uid);
      if (uid > 0) {
        Tournament.update({ id: tid }, { $addToSet: { participants: { pid: uid, name: null, excluded: false } } }, function (err, tnmt) {
          if (err) return next(err);
          sails.log.info('Registering user:%d to tournament:%s', uid, tid);
          res.json({ "msg": "OK", uid: uid });
        });
      } else if(closedRegistrations) {
        sails.log.warn('Registering: Tournament registrations closed !');
        res.status(403).json({ "error": "Tournament registrations closed !" });
      } else {
        sails.log.info('Registering: User not found');
        res.status(401).json({ "error": "User not found" });
      }*/
    //TODO gestion user
    var uid = 22;
    TournamentParticipant.findOrCreate({ tournament: tid, pid: uid }, { pid: uid, name: null, excluded: false, tournament: tid }, function (err, participant) {
      if (err) return res.serverError(err);
      sails.log.info('Registering participant: ', participant);
      res.json({ "msg": "Joined", uid: participant.pid });
    });
  },

  leaveTournamentJSON: function(req, res) {
    var tid = escape(req.params.id);

      //TODO : Faire toutes les verifs qui vont bien (Date, etc)
      /*var uid = req.uid;
      var closedRegistrations = isTournamentRegistrationsClosed(tournament, uid);
      if (uid > 0) {
        Tournament.update({ id: tid }, { $addToSet: { participants: { pid: uid, name: null, excluded: false } } }, function (err, tnmt) {
          if (err) return next(err);
          sails.log.info('Registering user:%d to tournament:%s', uid, tid);
          res.json({ "msg": "OK", uid: uid });
        });
      } else if(closedRegistrations) {
        sails.log.warn('Registering: Tournament registrations closed !');
        res.status(403).json({ "error": "Tournament registrations closed !" });
      } else {
        sails.log.info('Registering: User not found');
        res.status(401).json({ "error": "User not found" });
      }*/
    //TODO gestion user
    var uid = 22;
    TournamentParticipant.destroy({ tournament: tid, pid: uid }, function (err) {
      if (err) return res.serverError(err);
      sails.log.info('Unregistering participant: ', uid);
      res.json({ "msg": "Leaved", uid: uid });
    });
  },

  /**
  * `TournamentController.currentTournamentsJSON()`
  */
  currentTournamentsJSON: function (req, res) {
    // { populate: false, sort: 'startDate ASC', limit: 5, where: "{'startDate': {'>': '2016-04-04T10:57:08.976Z' }}" }
    var today = new Date();
    Tournament.find({'startDate': { '<=': today }, 'endDate': { '>=': today } }).sort('startDate ASC').limit(5).exec(function(err, tournaments) {
			if (err) { return res.serverError(err); }
			return res.json(tournaments);
    });
  },

  /**
  * `TournamentController.tournamentsPaginateJSON()`
  */
  tournamentsPaginateJSON: function (req, res) {
    var limit = req.param('limit', 5);
    var page = escape(req.params.page);
    Tournament.find().paginate({ page: page, limit: limit }).exec(function(err, tournaments) {
      if (err) { return res.serverError(err); }
      Tournament.count().exec(function(err, count) {
        if (err) return res.serverError(err);
        var contentRange = {
          start: (page-1) * limit,
          end: ((page-1) * limit) + limit,
          total: count
        };
        sails.log.silly('tournamentsPaginateJSON->Content-Range :: ' + contentRange.start + '-' + contentRange.end + '/' + contentRange.total);
        return res.json({tournaments: tournaments, contentRange: contentRange});
      });
    });
  }

};
