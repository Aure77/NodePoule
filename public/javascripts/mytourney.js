var MyTourney = MyTourney || {};

MyTourney = function() {

    var POWERSOFTWO = [1,2,4,8,16,32,64,128,256,512,1024,2048,4096,8192,16384,32768,
                    65536,131072,262144,524288,1048576,2097152,4194304,8388608,
                    16777216,33554432,67108864,134217728,268435456,536870912,
                    1073741824,2147483648];

    var defaultTemplate = '<div class="mytourney-block" style="<%= paddingStyle %>" data-mytourney-current-block-id="<%= match.matchId %>" data-mytourney-next-block-id="<%= match.nextMatchId %>"> \
        <% _.each([ match.user1, match.user2 ], function(user) { %> \
            <p class="mytourney-player-block" data-mytourney-player-id="<%= user.uid %>"> \
                <span class="mytourney-user" title="<%= user.username %>"> \
                    <% if(user.picture) { %><img class="mytourney-avatar" src="<%= user.picture %>" alt="avatar" /><% } %> \
                    <a href="<%= options.baseProfileUrl + "/" + user.uid %>" target="_blank"><%= user.username %></a> \
                </span> \
                <span class="mytourney-score"><%= user.score ? user.score : \"--\" %></span> \
            </p> \
        <% }); %> \
    </div>';
    
    var adminTemplate = '<div class="mytourney-block" style="<%= paddingStyle %>" data-mytourney-current-block-id="<%= match.matchId %>" data-mytourney-next-block-id="<%= match.nextMatchId %>"> \
        <% _.each([ match.user1, match.user2 ], function(user) { %> \
            <p class="mytourney-player-block" data-mytourney-player-id="<%= user.uid %>"> \
                <span class="mytourney-user" title="<%= user.username %>"> \
                    <% if(user.picture) { %><img class="mytourney-avatar" src="<%= user.picture %>" alt="avatar" /><% } %> \
                    <a href="<%= options.baseProfileUrl + "/" + user.uid %>" target="_blank"><%= user.username %></a> \
                </span> \
                <input class="mytourney-score" type="text" placeholder="--" value="<%= user.score %>" /> \
            </p> \
        <% }); %> \
    </div>';

    // Private method
    var isPowerOfTwo = function(x) {
        return ((x != 0) && ((x & (~x + 1)) == x));
    }

    // Public method
    var generateBracket = function(participants) {

        // On mélange les participants
        participants = _.shuffle(participants);

        var tours = [];
        var nbParticipants = participants.length;
        var matches = [];
        // Le tournoi aura un tour préliminaire si le nombre de participants n'est pas une puissance de 2.
        var containsPreliminary = !isPowerOfTwo(nbParticipants);
        if (containsPreliminary) {
            /*
                Trouver la puissance de 2 se rapprochant le plus (à l'inférieur) du nombre de participants actuels
                Ceci afin de trouver le nombre de combats du tour 1
            */
            var closest = 0;
            for (i = 0; i < POWERSOFTWO.length; i++) {
                if (POWERSOFTWO[i] < nbParticipants) {
                    closest = POWERSOFTWO[i];
                } else {
                    break;
                }
            }
            // Calculer la différence avec un nombre de participants 'classique' --> la diff correspond au nombre de matchs à jouer
            var diff = nbParticipants - closest;
            // Calculer le nombre de participants à prendre pour le tour préliminaire
            var taken = diff * 2;
            var preliminaryUsers = _.last(participants, taken) || [];
            /*
              Les matchs préliminaires sont ajoutés en fonction de la différence du nombre
              de participants du tournoi en cours avec un tournoi ayant un nombre de participants 
              égale à une puissance de 2.
            */
            var matchId = 0;
            for (i = 0; i < preliminaryUsers.length; i += 2) {
                matches.push({ user1: preliminaryUsers[i], user2: preliminaryUsers[i + 1], matchId: matchId++, nextMatchId: '' });
            }
            tours.push(matches);
            matches = [];
            /*
              remplir le 1er tour de matchs vides si le nombre de matchs 
              dans le tour préliminaire est supérieur à la moitié des matchs 
              d'un tournoi ayant un nombre de participants égale à une puissance de 2.
            */
            var nbParticipantsTour1 = nbParticipants - taken;
            var nbMatchsType = closest / 2;
            if (nbParticipantsTour1 < nbMatchsType) {
                for (i = nbParticipantsTour1; i < nbMatchsType; i++) {
                    matches.push({ user1: { uid: -1, username: '' }, user2: { uid: -1, username: '' }, matchId: matchId++, nextMatchId: '' });
                }
            }
        } else {
            var nbParticipantsTour1 = nbParticipants;
            var nbMatchsType = nbParticipants / 2;
        }

        /*
          Générer les matchs du tour 1 avec les participants restants.
        */
        for (i = 0; i < nbParticipantsTour1; i++) {
            if (i >= diff) {
                matches.push({ user1: participants[i], user2: participants[++i], matchId: matchId++, nextMatchId: '' });
            } else {
                matches.push({ user1: participants[i], user2: { uid: -1, username: '' }, matchId: matchId++, nextMatchId: '' });
            }
        }
        tours.push(matches);

        /*
          Créer les futurs matchs vides des tours suivants.
        */
        var nb = nbMatchsType;
        while (nb > 1) {
            matches = [];
            for (i = 0; i < nb; i += 2) {
                matches.push({ user1: { uid: -1, username: '' }, user2: { uid: -1, username: '' }, matchId: matchId++, nextMatchId: '' });
            }
            tours.push(matches);
            nb = nb / 2;
        }

        /*
          Lier les matchs entre eux d'un tour à l'autre
          Si le match contient 2emplacements libres, alors lier à 2matchs du tour précédent
        */
        var matchesTaken = 0;
        for (i = tours.length - 1; i > 0; i--) {
            matchesTaken = 0;
            $.each(tours[i], function(nMatch, match) {
                if (match.user1.uid == -1) {
                    if (match.user2.uid == -1) {
                        tours[i - 1][matchesTaken].nextMatchId = match.matchId;
                        tours[i - 1][matchesTaken + 1].nextMatchId = match.matchId;
                        matchesTaken = matchesTaken + 2;
                    } else {
                        tours[i - 1][j + matchesTaken].nextMatchId = match.matchId;
                        matchesTaken++;
                    }
                } else if (match.user2.uid == -1) {
                    tours[i - 1][matchesTaken].nextMatchId = match.matchId;
                    matchesTaken++;
                }
            });
        }
        //drawBracket(participants, tours, container);
        return tours;
    };

    // Public method
    var roundsToModel = function(rounds) {
        var modelRounds = [];
        $.each(rounds, function(nRound, matches) {
            $.each(matches, function(nMatch, match) {
                modelRounds.push({
                  matchId : match.matchId,
                  nextMatchId : match.nextMatchId,
                  pid1 : match.user1.uid == -1 ? null : match.user1.uid,
                  pid2 : match.user2.uid == -1 ? null : match.user2.uid,
                  score1 : match.user1.score,
                  score2 : match.user2.score,
                  eventDate : null,
                  round : nRound+1
                });
            });
        });
        return modelRounds;
    };

    // Public method
    var drawBracket = function(opt) {
        // Le tournoi aura un tour préliminaire si le nombre de participants n'est pas une puissance de 2.
        var containsPreliminary = !isPowerOfTwo(opt.participants.length);
        var offsetTour = 26;
        var padding = 0;
        var paddingStyle = '';
        var prevNextMatchId = -1;
        var prevMatchDouble = 0;

        var renderTemplate = _.template(opt.template ? opt.template : defaultTemplate);

        $.each(opt.rounds, function(nTour, matches) {
            /*
              Création d'un tour
            */
            var divTour = $('<div>', {
                class: 'mytourney-tour'
            });
            divTour.append('<span>Tour ' + (1 + nTour) + '</span>');
            $.each(matches, function(nMatch, match) {
                /*
                  Pour chaque tour il faut décaler les matchs de sorte à ce qu'ils soient
                  positionnés au milieu des matchs précédents.
                  Sauf pour le premier tour.
                  Dans le cadre d'un tour préliminaire, on ne peut anticiper s'il y aura un nombre pair
                  ou impair. Il faut donc voir si les matchs fonctionnement par pair ou s'ils sont seuls.
                */
                if (nTour > 0) {
                    padding = offsetTour * Math.pow(2, nTour) - offsetTour;
                    paddingStyle = 'padding-top:' + padding + 'px;padding-bottom:' + padding + 'px;';
                } else if (containsPreliminary) {
                    if (prevNextMatchId != -1 && prevMatchDouble % 2 != 0 && prevNextMatchId != match.nextMatchId) {
                        paddingStyle = "margin-top:" + offsetTour * 2 + 'px;';
                    }
                    prevMatchDouble++;
                }

                /*
                  Création d'un 'block' de match depuis le template
                */
                var html = renderTemplate({ paddingStyle: paddingStyle, match : match, options: opt });
                prevNextMatchId = match.nextMatchId;
                /*
                  Ajouter le match au tour en cours.
                */
                divTour.append(html);
            });
            /*
              Ajouter le tour au tournoi.
            */
            divTour.appendTo(opt.container);
        });

        /*
          Au survol de la souris sur un participant, son parcours dans le tournoi
          est affiché.
        */
        $(document).on('mouseenter', '.player-block', function(e) {
            if ($(this).attr('data-mytourney-player-id') != -1) {
                var selector = '.player-block[data-mytourney-player-id=\'' + $(this).attr('data-mytourney-player-id') + '\'] .mytourney-user';
                $(selector).addClass('selected');
            }
        }).on("mouseleave", '.player-block', function() {
            $('.player-block .mytourney-user').removeClass('selected');
        });
        connectBlocks();
    };

    // Private method
    var connectBlocks = function() {
        var color = "#7AB02C";
        //var oldColor  = color;
        //var oldId = 0;
        $('.mytourney-tour').each(function() {
            var currentTour = $(this);
            currentTour.find('.mytourney-block').each(function() {
                //color = getRandomColor();
                var block = $(this);
                var id = block.attr('data-mytourney-next-block-id');
                var nextBlock = currentTour.next().find('.mytourney-block[data-mytourney-current-block-id=\'' + id + '\']');
                if(block.length && nextBlock.length) { // blocks exists
                    jsPlumb.connect({
                        source: block,
                        target: nextBlock,
                        anchors: ["Right", "Left"],
                        endpoint: "Rectangle",
                        endpointStyle: {
                            //fillStyle: (oldId == id ? oldColor : color),
                            fillStyle: color,
                            width: 5,
                            height: 5
                        },
                        connector: "Flowchart",
                        paintStyle: {
                            //strokeStyle:(oldId == id ? oldColor : color),
                            strokeStyle: color,
                            fillStyle: "transparent",
                            lineWidth: 1
                        },
                        detachable: false
                    });
                }
                //oldId = id;
                //oldColor = color;
            });
        });
    };

    //function getRandomColor() {
    //    var values = '0123456789ABCDEF'.split('');
    //    var color = '#';
    //    for (var i = 0; i < 6; i++ ) {
    //        color += values[Math.floor(Math.random() * 16)];
    //    }
    //    return color;
    //}



    // return public methods
    var oPublic = {
        generateBracket: generateBracket,
        drawBracket: drawBracket,
        roundsToModel: roundsToModel,
        adminTemplate: adminTemplate
    };
    return oPublic;

}();