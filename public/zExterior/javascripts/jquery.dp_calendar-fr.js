jQuery(function($){
	$.fn.dp_calendar.regional[''] = {
		closeText: 'Fermer',
		prevText: '&#x3c;Ant',
		nextText: 'Sig&#x3e;',
		currentText: 'Aujourdh\'ui',
		monthNames: ['Janvier','Fevrier','Mars','Avril','Mai','Juin',
		'Juillet','Aout','Septembre','Octobre','Novembre','Decembre'],
		monthNamesShort: ['Jan','Fev','Mar','Avr','Mai','Juin',
		'Juil','Aou','Sep','Oct','Nov','Dec'],
		dayNames: ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'],
		dayNamesShort: ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'],
		dayNamesMin: ['Di','Lu','Ma','Me','Je','Ve','Sa'],
		DP_LBL_NO_ROWS: 'Rien ce jour',
		DP_LBL_SORT_BY: 'Trier par',
		DP_LBL_TIME: 'HEURE',
		DP_LBL_TITLE: 'TITRE',
		DP_LBL_PRIORITY: 'PRIORITE'};
	$.datepicker.regional[''] = $.fn.dp_calendar.regional[''];
});