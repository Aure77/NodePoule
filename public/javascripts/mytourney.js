var tourneyUsers = _.shuffle([
					{uid:0,name:'Thomas'},
					{uid:1,name:'Julien'},
					{uid:2,name:'Adrien'},
					{uid:3,name:'Guillaume'},
					{uid:4,name:'Aurélien'},
					{uid:5,name:'Geoffrey'},
					{uid:6,name:'Pierre'},
					{uid:7,name:'Eric'},
					{uid:8,name:'Cécile'},
					{uid:9,name:'Maxime'},
					{uid:10,name:'Francois'},
					{uid:11,name:'Kevin'},
					{uid:12,name:'William'},
					{uid:13,name:'Thibault'},
					{uid:14,name:'Patrick'},
					{uid:15,name:'Brice'},
					{uid:16,name:'Jérémy'},
					{uid:17,name:'John'},
					{uid:18,name:'Maurice'}
					]);					
var POWERSOFTWO = [1,2,4,8,16,32,64,128,256,512,1024,2048,4096,8192,16384,32768,
					65536,131072,262144,524288,1048576,2097152,4194304,8388608,
					16777216,33554432,67108864,134217728,268435456,536870912,
					1073741824,2147483648];
var preliminaryUsers = [];
var closest = 0;
var nbMatchsType = 0;
var diff = 0;
var taken = 0;
var tours = [];
var offsetTour = 25;
var nbParticipants = 0;
var nbParticipantsTour1 = 0;
var matchId = 0;
var containsPreliminary = false;
var profileUrl = '/profile/';

function isPowerOfTwo (x){
  return ((x != 0) && ((x & (~x + 1)) == x));
}

function generateBracket(tourneyUsers, container){
	nbParticipants = tourneyUsers.length;
	var matches = [];
	//Le tournoi aura un tour préliminaire si le nombre de participants n'est pas une puissance de 2.
	containsPreliminary = !isPowerOfTwo (nbParticipants);
	if(containsPreliminary){
		//Trouver la puissance de 2 se rapprochant le plus (à l'inférieur) du nombre de participants actuels
		//Ceci afin de trouver le nombre de combats du tour 1
		for(i = 0; i < POWERSOFTWO.length; i++){
			if(POWERSOFTWO[i] < nbParticipants){
				closest = POWERSOFTWO[i];
			}else{
				break;
			}
		}
		//Calculer la différence avec un nombre de participants 'classique' --> la diff correspond au nombre de matchs à jouer
		diff = nbParticipants - closest;
		//Calculer le nombre de participants à prendre pour le tour préliminaire
		taken = diff * 2;
		preliminaryUsers = _.last(tourneyUsers, taken);
		/*
			Les matchs préliminaires sont ajoutés en fonction de la différence du nombre
			de participants du tournoi en cours avec un tournoi ayant un nombre de participants 
			égale à une puissance de 2.
		*/
		for(i = 0; i < preliminaryUsers.length; i += 2){
			matches.push({ user1: preliminaryUsers[i] , user2: preliminaryUsers[i + 1] , matchId: matchId++, nextMatchId : ''});
		}
		tours.push(matches);
		matches = [];
		/*
			remplir le 1er tour de matchs vides si le nombre de matchs 
			dans le tour préliminaire est supérieur à la moitié des matchs 
			d'un tournoi ayant un nombre de participants égale à une puissance de 2.
		*/
		nbParticipantsTour1 = nbParticipants - taken;
		nbMatchsType = closest / 2;
		if(nbParticipantsTour1 < nbMatchsType){
			for(i = nbParticipantsTour1; i < nbMatchsType ; i++){
				matches.push({ user1: {uid:-1,name:''} , user2: {uid:-1,name:''} , matchId: matchId++, nextMatchId : ''});
			}
		}
	}
	
	/*
		Générer les matchs du tour 1 avec les participants restants.
	*/
	for(i = 0; i < nbParticipantsTour1; i++){
		if( i >= diff){
			matches.push({ user1: tourneyUsers[i] , user2: tourneyUsers[++i] , matchId: matchId++, nextMatchId : ''});
		}else{
			matches.push({ user1: tourneyUsers[i] , user2: {uid:-1,name:''} , matchId: matchId++, nextMatchId : ''});
		}
	}
	tours.push(matches);
	
	/*
		Créer les futurs matchs vides des tours suivants.
	*/
	var nb = nbMatchsType;
	while(nb > 1){
		matches = [];
		for(i = 0; i < nb; i += 2){
			matches.push({ user1: {uid:-1,name:''} , user2: {uid:-1,name:''} , matchId: matchId++, nextMatchId : ''});
		}
		tours.push(matches);
		nb = nb / 2;
	}
	
	/*
		Lier les matchs entre eux d'un tour à l'autre		
		Si le match contient 2emplacements libres, alors lier à 2matchs du tour précédent
	*/
	var matchesTaken = 0;
	for(i = tours.length - 1; i > 0; i--){
		matchesTaken = 0;
		$.each(tours[i], function(nMatch, match) {
			if(match.user1.uid == -1){
				if(match.user2.uid == -1){
					tours[i-1][matchesTaken].nextMatchId = match.matchId;
					tours[i-1][matchesTaken+1].nextMatchId = match.matchId;
					matchesTaken = matchesTaken+2;
				}else{
					tours[i-1][j+matchesTaken].nextMatchId = match.matchId;
					matchesTaken++;
				}
			}else{
				if(match.user2.uid == -1){
					tours[i-1][matchesTaken].nextMatchId = match.matchId;
					matchesTaken++;
				}else{
				}
			}
		});
	}
	drawBracket(container);
}

function drawBracket(container){
	var padding = 0;
	var paddingStyle = '';
	var prevNextMatchId = -1;
	var prevMatchDouble = 0;
	$.each(tours, function(nTour, matches) {
		/*
			Création d'un tour
		*/
		var divTour = $('<div>', { class: 'mytourney-tour' });
		divTour.append('<span>Tour ' + (1 + nTour) + '</span>');
		$.each(matches, function(nMatch, match) {
			/*
				Pour chaque tour il faut décaler les matchs de sorte à ce qu'ils soient
				positionnés au milieu des matchs précédents.
				Sauf pour le premier tour.
				Dans le cadre d'un tour préliminaire, on ne peut anticiper s'il y aura un nombre pair
				ou impair. Il faut donc voir si les matchs fonctionnement par pair ou s'ils sont seuls.
			*/
			if(nTour > 0){
				padding = offsetTour * Math.pow(2,nTour) - offsetTour;
				paddingStyle = 'padding-top:' + padding + 'px;padding-bottom:' + padding + 'px;';
			}else if(containsPreliminary){
				if(prevNextMatchId != -1 && prevMatchDouble % 2 != 0 && prevNextMatchId != match.nextMatchId){
					paddingStyle = "margin-top:" + offsetTour * 2 + 'px;';
				}
				prevMatchDouble++;
			}
			/*
				Création d'un 'block' de match
			*/
			var divBlock = $('<div>', { class : 'mytourney-block', curblockid :  match.matchId, nextblockid : match.nextMatchId, style : paddingStyle});
			var pBlock = $('<p>', { playerid : match.user1.uid, class : 'player-block' });
			var profileLink = $('<a>', { href : profileUrl + match.user1.uid, target : '_blank'}).html(match.user1.name);
			$('<span>', { class: 'mytourney-user', title: match.user1.name }).append(profileLink).appendTo(pBlock);
			$('<span>', { class: 'mytourney-score' }).html('--').appendTo(pBlock);
			pBlock.appendTo(divBlock);
			pBlock = $('<p>', { playerid : match.user2.uid, class : 'player-block' });
			profileLink = $('<a>', { href : profileUrl + match.user2.uid, target : '_blank'}).html(match.user2.name);
			$('<span>', { class: 'mytourney-user', title: match.user2.name }).append(profileLink).appendTo(pBlock);
			$('<span>', { class: 'mytourney-score' }).html('--').appendTo(pBlock);
			pBlock.appendTo(divBlock);
			prevNextMatchId = match.nextMatchId;
			/*
				Ajouter le match au tour en cours.
			*/
			divBlock.appendTo(divTour);
		});
		/*
			Ajouter le tour au tournoi.
		*/
		divTour.appendTo(container);
	});
	
	/*
		Au survol de la souris sur un participant, son parcours dans le tournoi
		est affiché.
	*/
	$(document).on('mouseenter', '.player-block',  function(e) {
		if($(this).attr('playerid') != -1){
			var selector  = '.player-block[playerid=\'' + $(this).attr('playerid') + '\'] .mytourney-user';
			$(selector).addClass('selected');
		}
	}).on("mouseleave", '.player-block', function() {
		$('.player-block .mytourney-user').removeClass('selected');
	});
	connectBlocks();
}

function connectBlocks(){

	var color = "#7AB02C";
	//var oldColor  = color;
	//var oldId = 0;
	$('.mytourney-tour').each(function(){
		var currentTour = $(this);
		currentTour.find('.mytourney-block').each(function(){
			//color = getRandomColor();
			var id = $(this).attr('nextblockid');
			var nextBlock = currentTour.next().find('.mytourney-block[curblockid=\'' + id + '\']');
			jsPlumb.connect({
				source:$(this), 
				target:nextBlock,
				anchors:["Right", "Left" ],
				endpoint:"Rectangle",
				endpointStyle:{ 
					//fillStyle: (oldId == id ? oldColor : color),
					fillStyle: color,
					width:5,
					height:5
				},
				connector:"Flowchart",
				paintStyle:{ 
					//strokeStyle:(oldId == id ? oldColor : color),
					strokeStyle: color,
					fillStyle:"transparent",
					lineWidth:1 
				}
			});
			//oldId = id;
			//oldColor = color;
		});
	});
}

//function getRandomColor() {
//    var values = '0123456789ABCDEF'.split('');
//    var color = '#';
//    for (var i = 0; i < 6; i++ ) {
//        color += values[Math.floor(Math.random() * 16)];
//    }
//    return color;
//}
