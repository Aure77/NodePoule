/**
 * TournamentService
 *
 * @description :: Server-side logic for managing tournaments
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/services
 */
var _ = require('underscore');
var moment = require('moment');

module.exports = {

  isTournamentRegistrationsClosed: function(tournament, uid) {
    var isTournamentRegistrationsClosed = tournament.closedRegistrations || isNaN(uid) || moment(tournament.startDate).isBefore(/*now*/) /*|| moment(tournament.endDate).isAfter(/*now*//*) || userIsRegistered*/;
    sails.log.debug('tournament.closedRegistrations=%s || isNaN(uid)=%s || moment(tournament.startDate).isBefore(/*now*/)=%s', tournament.closedRegistrations, isNaN(uid), moment(tournament.startDate).isBefore(/*now*/));
    sails.log.info('Tournament "%s" registrations closed : %s', tournament.tournamentId, isTournamentRegistrationsClosed);
    return isTournamentRegistrationsClosed;
  },

  isUserHasJoinTournament: function(registeredUsers, uid) {
    var userHasJoinTournament = uid > 0 ? _.find(registeredUsers, function (item) { return item.uid === uid; }) != null : false;
    sails.log.info('userHasJoinTournament : %s', userHasJoinTournament);
    return userHasJoinTournament;
  }

};
