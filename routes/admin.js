var _ = require('underscore');
var express = require('express');
var util = require('util');
var nconf = require('nconf');
var escape = require('escape-html');
var paginate = require('express-paginate');
var mongoose = require('mongoose'), Tournament = mongoose.model('Tournament'), User = mongoose.model('User'), News = mongoose.model('News');;
var router = express.Router();

router.use(paginate.middleware(4, 50));

/* GET Dashboard page. */
router.get('/', function(req, res, next) {
    res.render('admin/index', { 
      title: 'Dashboard', 
      htitle: 'Dashboard'
  });    
});

/* GET Dashboard page. */
router.get('/users', function(req, res, next) {
    res.redirect('forum.nodepoule.eu/users');
});

/* GET news page. */
router.get('/news', function(req, res, next) {
  var page = escape(req.query.page);
  var limit = escape(req.query.limit);
  News.paginate({}, { page: page, limit: limit }, function(err, newsCollection, pageCount, itemCount) {
    if (err) { return next(err); }
    res.render('admin/news', { 
      title: 'News management', 
      htitle: 'News management', 
      newsCollection: newsCollection, 
      pageCount: pageCount,
      itemCount: itemCount
    });
  },
  {sortBy: '-date'});
});

/* GET news page. */
router.get('/news/:id', function(req, res, next) {
  var newsId = escape(req.params.id);
  News.findOne({ newsId : newsId }).exec(function(err, news) {
    if (err) { return next(err); }    
    if(!news) {
      return next(new Error("La news '"+newsId+"' est introuvable"));
    }
    res.render('admin/news-editor', { title: news.title, news: news });
  });
});

/* GET news page. */
router.get('/tournaments', function(req, res, next) {
  var page = escape(req.query.page);
  var limit = escape(req.query.limit);
  Tournament.paginate({}, { page: page, limit: limit }, function (err, tournaments, pageCount, itemCount) {
    if (err) { return next(err); }
    res.render('admin/tournaments', {
      title: 'Tous les tournois',
      htitle: 'Tous les tournois',
      tournaments: tournaments,
      pageCount: pageCount,
      itemCount: itemCount
    });
  });
});

/* GET tournaments page. */
router.get('/tournaments/:id', function(req, res, next) {
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
        user1.score = match.score1;
        var user2 = match.pid2 != null ? _.find(participants, function (item) { return item.uid === match.pid2; }) : { uid: -1, name: '' };
        user2.score = match.score2;
        rounds[roundIndex].push({ user1: user1, user2: user2, matchId: match.matchId, nextMatchId: match.nextMatchId });
      });
      res.render('admin/tournament-editor', { title: tournament.name, htitle: tournament.name, tournament: tournament, participants: participants, rounds: rounds });

    });
  });
});

module.exports = router;