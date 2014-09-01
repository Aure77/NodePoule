/*
 * jQuery DP Calendar v1.5
 *
 * Copyright 2011, Diego Pereyra
 * PATCHED BY Mohye & Ghannou 
 *
 * @Web: http://www.dpereyra.com
 * @Email: info@dpereyra.com
 *
 * Depends:
 *	jquery.ui.core.js
 *  date.js
 *	jquery.ui.datepicker.js
 */

(function ($) {
	$.fn.dp_calendar = function (options) {	
	
		
		/* Setting vars*/
		var opts, events_array, date_selected, order_by, format_ampm, show_datepicker, link_color, show_priorities, show_sort_by, onChangeMonth, onChangeDay, onClickMonthName, onClickEvents, DP_LBL_NO_ROWS, DP_LBL_SORT_BY, DP_LBL_TIME, DP_LBL_TITLE, DP_LBL_PRIORITY, div_main_date, main_date, prev_month, toggleDP, next_month, div_dates, list_days, clear, div_clear, day_name, calendar_list, h2_sort_by, cl_sort_by, li_time, li_title, li_priority, ul_list, $dp, curr_day, curr_day_name, curr_date, curr_month_name_short, curr_month, curr_month_name, curr_year, ul_list_days, added_events;
		
		var sort_ascdesc = 1;
		
		opts = $.extend({}, $.fn.dp_calendar.defaults, options);
		
		events_array = opts.events_array;
		date_selected = opts.date_selected;
		order_by = opts.order_by;
		format_ampm = opts.format_ampm;
		show_datepicker = opts.show_datepicker;
		link_color = opts.link_color;
		show_priorities = opts.show_priorities;
		show_sort_by = opts.show_sort_by;
		onChangeMonth = opts.onChangeMonth;
		onChangeDay = opts.onChangeDay;
		onClickMonthName = opts.onClickMonthName;
		onClickEvents = opts.onClickEvents;
		
		/* Labels & Messages*/
		DP_LBL_EVENTS = $.fn.dp_calendar.regional['']['DP_LBL_EVENTS'];
		DP_LBL_NO_ROWS = $.fn.dp_calendar.regional['']['DP_LBL_NO_ROWS'];
		DP_LBL_SORT_BY = $.fn.dp_calendar.regional['']['DP_LBL_SORT_BY'];
		DP_LBL_TIME = $.fn.dp_calendar.regional['']['DP_LBL_TIME'];
		DP_LBL_TITLE = $.fn.dp_calendar.regional['']['DP_LBL_TITLE'];
		DP_LBL_PRIORITY = $.fn.dp_calendar.regional['']['DP_LBL_PRIORITY'];
		
		/* Padding function */
		function dp_str_pad(input, pad_length, pad_string, pad_type) {
			var half = '',
				pad_to_go,
				str_pad_repeater;
		 
			str_pad_repeater = function (s, len) {
				var collect = '',
					i;
		 
				while (collect.length < len) {
					collect += s;
				}
				collect = collect.substr(0, len);
		 
				return collect;
			};
		 
			input += '';
			pad_string = pad_string !== undefined ? pad_string : ' ';
		 
			if (pad_type !== 'STR_PAD_LEFT' && pad_type !== 'STR_PAD_RIGHT' && pad_type !== 'STR_PAD_BOTH') {
				pad_type = 'STR_PAD_RIGHT';
			}
			if ((pad_to_go = pad_length - input.length) > 0) {
				if (pad_type === 'STR_PAD_LEFT') {
					input = str_pad_repeater(pad_string, pad_to_go) + input;
				} else if (pad_type === 'STR_PAD_RIGHT') {
					input = input + str_pad_repeater(pad_string, pad_to_go);
				} else if (pad_type === 'STR_PAD_BOTH') {
					half = str_pad_repeater(pad_string, Math.ceil(pad_to_go / 2));
					input = half + input + half;
					input = input.substr(0, pad_length);
				}
			}
		 
			return input;
		}
		
		/* in_array function */
		function dp_in_array (needle, haystack, argStrict) {
			var key = '',
				strict = !! argStrict;
		 
			if (strict) {
				for (key in haystack) {
					if (haystack[key] === needle) {
						return true;
					}
				}
			} else {
				for (key in haystack) {
					if (haystack[key] == needle) {
						return true;
					}
				}
			}
		 
			return false;
		}
				
		/* calculeDates() Core function */
		function calculeDates() {
			/* Setting vars */
			var newLI, newText, i;

			
			curr_day = date_selected.getDay();
			curr_day_name = $.datepicker.regional[""].dayNames[curr_day];
			curr_date = date_selected.getDate();
			curr_month = date_selected.getMonth();
			curr_month_name = $.datepicker.regional[""].monthNames[curr_month];
			curr_month_name_short = $.datepicker.regional[""].monthNamesShort[curr_month];
			curr_year = date_selected.getFullYear();
			//Set defaults options
			$.fn.dp_calendar.date_selected = date_selected;
			$.fn.dp_calendar.order_by = order_by;
			$.fn.dp_calendar.format_ampm = format_ampm;
			$.fn.dp_calendar.curr_day = curr_day;
			$.fn.dp_calendar.curr_day_name = curr_day_name;
			$.fn.dp_calendar.curr_date = curr_date;
			$.fn.dp_calendar.curr_month = curr_month;
			$.fn.dp_calendar.curr_month_name = curr_month_name;
			$.fn.dp_calendar.curr_month_name_short = curr_month_name_short;
			$.fn.dp_calendar.curr_year = curr_year;
			
			/* Clean the list of days */
			//while (ul_list_days.firstChild) { ul_list_days.removeChild(ul_list_days.firstChild); }
			$(ul_list_days).html("");
			
			if(order_by === 1) {
				events_array.sort(function(a,b) {
					sort = a.startDate > b.startDate * sort_ascdesc;
					return sort;
				});
			}
			if(order_by === 2) {
				events_array.sort(function(a,b) {
					sort = a.title.toLowerCase().localeCompare(b.title.toLowerCase()) * sort_ascdesc;
					return sort;
				});
				
			}
			if(order_by === 3) {
				events_array.sort(function(a,b) {
					a = a.priority;
					b = b.priority;
					sort = (a == b ? 0 : (a > b ? -1 : 1))  * sort_ascdesc;
					return sort;
				});
				
			}
			sort_ascdesc *= -1;
			
			/* Update the list of days*/
			for (i = 1; i <= new Date(curr_year, (curr_month + 1), 0).getDate(); i++) {
				newLI = $('<li />');
				
				if (curr_date === i) {
					newLI.addClass("active");
				}
				newText = document.createTextNode(dp_str_pad(i, 2, "0", "STR_PAD_LEFT"));
				
				$(newLI).html(newText).attr('id', 'dpEventsCalendar_li_'+new Date(curr_year, curr_month, i).getTime());
				$(ul_list_days).append(newLI);
			}
			
			jQuery($(div_dates).find("li")).css("color", link_color);
			jQuery($(cl_sort_by).find("li")).css("color", link_color);
			//ul_list_days.style.width = (new Date(curr_year, (curr_month + 1), 0).getDate() * 14) + "px";
			
			/* Onclick Days Event*/
			$($(ul_list_days).find("li")).click(function (e) {
	
				date_selected = new Date(curr_year, curr_month, $(this).html());
				$($(ul_list_days).find("li")).each(function (i) {
					this.className = "";	
				});
				this.className = "active";	
				calculeDates();	
				onChangeDay();
			});
			
			/* Days and Months Labels*/
			$(day_name).html("");
			$(day_name).append("<h1>" + curr_day_name + "</h1>");
			$(day_name).append('<div class="div_month"><span class="span_month">' + curr_month_name_short + '</span><br><span class="span_day">' + dp_str_pad(curr_date, 2, "0", "STR_PAD_LEFT") + '</span></div>');		
			   
			$dp.datepicker("setDate", date_selected);
			$(toggleDP).html(curr_month_name + " " + curr_year);
			
			/* Preloader Message */
			$(ul_list).html("<div class='loading'></div>");
			
			/* Events Request */
			added_events = 0;
			
			$(events_array).each(function(i){
				if(typeof(this.startDate) == "object") {
					/* Set classes */
					if(curr_year === this.startDate.getFullYear() && curr_month === this.startDate.getMonth()){
						$(ul_list_days).children("li")[(this.startDate.getDate() - 1)].className = $(ul_list_days).children("li")[(this.startDate.getDate() - 1)].className == "active" ? "active" : "has_events";
					}
					
					/* Load the events list*/
					if(new Date(date_selected.getFullYear(), date_selected.getMonth(), date_selected.getDate()).getTime() === new Date(this.startDate.getFullYear(), this.startDate.getMonth(), this.startDate.getDate()).getTime()){
						
						var li_event, li_event_time, li_event_title, li_event_description;
						
						if(added_events === 0) {
							$(ul_list).html("");
						}
						
						added_events++;
						
						li_event = $('<li />');
						if(this.priority == 1) {
							$(li_event).addClass("low");
						} else if(this.priority == 2) {
							$(li_event).addClass("medium");
						} else {
							$(li_event).addClass("urgent");
						}
						
						$(ul_list).append(li_event);
						
						li_event_time = $('<div />').addClass('time');
						if(!format_ampm) {
								$(li_event_time).html(dp_str_pad(this.startDate.getHours(),2,"0","STR_PAD_LEFT")+":"+dp_str_pad(this.startDate.getMinutes(),2,"0","STR_PAD_LEFT"));
						} else {
								$(li_event_time).html((this.startDate.getHours() > 12 ? "PM" : "AM") + " " + dp_str_pad((this.startDate.getHours() > 12 ? (this.startDate.getHours() - 12) : this.startDate.getHours()),2,"0","STR_PAD_LEFT")+":"+dp_str_pad(this.startDate.getMinutes(),2,"0","STR_PAD_LEFT"));
						}
						
						
						li_event_title = $('<h1 />');
						$(li_event_title).append(this.title);
						
						clear = $('<div />').addClass('clear');
		
						li_event_description = $('<p />');
						$(li_event_description).html(this.description);
						
						$(li_event).append(li_event_time);
						$(li_event).append(li_event_title);
						$(li_event).append(clear);
						$(li_event).append(li_event_description);
						
						
					}
				}
			});
			
			$($(ul_list).find("li")).click(function (e) {
				onClickEvents();
				if ($(this).find("p").css("display") === "none") {
					$(this).find("p").slideDown(300);
				} else {
					$(this).find("p").slideUp(300);
				}
			});	
			
			if (added_events === 0) {
				$(ul_list).html(DP_LBL_NO_ROWS);;
			}
			
		}
		
		
		/* CREATING THE HTML CODE */
		
		this.addClass("dp_calendar");
		this.html("");
		
		div_main_date = $('<div />').addClass('div_main_date');
		
		main_date = $('<div />').addClass('main_date');

		$(div_main_date).append(main_date);
		
		prev_month = $('<a />').attr({href : 'javascript:void(0);', id: 'prev_month'}).html('&laquo;');

		
		toggleDP = $('<a />').attr({href : 'javascript:void(0);', id: 'toggleDP'});
		
		next_month = $('<a />').attr({href : 'javascript:void(0);', id: 'next_month'}).html('&raquo;');

		
		$(main_date).append(prev_month);
		$(main_date).append(toggleDP);
		$(main_date).append(next_month);
		this.append(div_main_date);
		
		div_dates = $('<div />').addClass('div_dates');
		
		list_days = $('<ul />').attr('id', 'list_days');
		ul_list_days = list_days;
		
		clear = $('<div />').addClass('clear');
		
		day_name = $('<div />').addClass('day_name').attr('id', 'day_name');
		
		$(div_dates).append(ul_list_days);
		div_clear = $('<div />').addClass('clear');
		$(div_dates).append(div_clear);
		$(div_dates).append(day_name);
		div_clear = $('<div />').addClass('clear');
		$(div_dates).append(div_clear);
		this.append(div_dates);
		
		calendar_list = $('<div />').addClass('calendar_list');
		
		cl_sort_by = $('<ul />').attr('id', 'cl_sort_by');
		
		li_time = $('<li />');
		if (order_by === 1) {
			li_time.addClass("active");
		}
		$(li_time).html(DP_LBL_TIME);
		li_title = $('<li />');
		if (order_by === 2) {
			li_title.addClass("active");
		}
		$(li_title).html(DP_LBL_TITLE);
		
		li_priority = $('<li />');
		if (order_by === 3) {
			li_priority.addClass("active");
		}
		$(li_priority).html(DP_LBL_PRIORITY);
		
		
		$(cl_sort_by).append(li_time);
		$(cl_sort_by).append(li_title);
		if(show_priorities) {
			$(cl_sort_by).append(li_priority);
		}
		
		ul_list = $('<ul />').attr('id', 'list');
		
		if(show_sort_by) {
			h2_sort_by = $('<h2 />');
			$(h2_sort_by).html(DP_LBL_SORT_BY);
			
			$(calendar_list).append(h2_sort_by);
			$(calendar_list).append(cl_sort_by);
		} else {
			h2_sort_by = $('<h2 />');
			$(h2_sort_by).html(DP_LBL_EVENTS);
			
			$(calendar_list).append(h2_sort_by);
		}
		$(calendar_list).append(clear);
		$(calendar_list).append(ul_list);
		this.append(calendar_list);
		
		
		$dp = $("<input type='text' />").hide().datepicker({
			onSelect: function (dateText, inst) {
			    date_selected = new Date(dateText);
			    calculeDates();
			}
		}).appendTo('body');
		
		$(toggleDP).click(function (e) {
			if (show_datepicker === true) {
				if ($dp.datepicker('widget').is(':hidden')) {
					$dp.datepicker("show");
					$dp.datepicker("widget").position({
						my: "top",
						at: "top",
						of: this
					});
				} else {
					$dp.hide();
				}
				
			}
			onClickMonthName();
		
			e.preventDefault();
		});	
		
		
		calculeDates();
		
		$(next_month).click(function (e) {
			date_selected = date_selected.add(1).month();
			calculeDates();
			onChangeMonth();
		});
		
		$(prev_month).click(function (e) {
			date_selected = date_selected.add(-1).month();
			calculeDates();
			onChangeMonth();
		});
		
		$($(cl_sort_by).find("li")).click(function (e) {
			$($(cl_sort_by).find("li")).each(function (i) {
				this.className = "";
			});
			this.className = "active";
			$($(cl_sort_by).find("li")).each(function (i) {
				if (this.className === "active") { order_by = (i + 1); }
			});
			calculeDates();
		});
		
		
	};	
	
	/* Default Parameters and Events */
	$.fn.dp_calendar.defaults = {  
		events_array: new Array(),
		date_selected: new Date(),
		order_by: 1,
		show_datepicker: true,
		show_priorities: true,
		show_sort_by: true,
		format_ampm: false,
		onChangeMonth: function () {},
		onChangeDay: function () {},
		onClickMonthName: function () {},
		onClickEvents: function () {},	
		link_color: '#929292'
	};
	
	/* Global parameters */
	$.fn.dp_calendar.date_selected = $.fn.dp_calendar.defaults.date_selected;
	$.fn.dp_calendar.order_by = $.fn.dp_calendar.defaults.order_by;
	$.fn.dp_calendar.format_ampm = $.fn.dp_calendar.defaults.format_ampm;
	$.fn.dp_calendar.curr_day = "";
	$.fn.dp_calendar.curr_day_name = "";
	$.fn.dp_calendar.curr_date = "";
	$.fn.dp_calendar.curr_month = "";
	$.fn.dp_calendar.curr_month_name = "";
	$.fn.dp_calendar.curr_month_name_short = "";
	$.fn.dp_calendar.curr_year = "";
	$.fn.dp_calendar.regional = [];
	$.fn.dp_calendar.regional[''] = {
		closeText: 'Done',
		prevText: 'Prev',
		nextText: 'Next',
		currentText: 'Today',
		monthNames: ['January','February','March','April','May','June',
		'July','August','September','October','November','December'],
		monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
		'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
		dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
		dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
		dayNamesMin: ['Su','Mo','Tu','We','Th','Fr','Sa'],
		DP_LBL_EVENTS: 'Events',
		DP_LBL_NO_ROWS: 'No results were found in this date.',
		DP_LBL_SORT_BY: 'SORT BY:',
		DP_LBL_TIME: 'TIME',
		DP_LBL_TITLE: 'TITLE',
		DP_LBL_PRIORITY: 'PRIORITY'};
	
	
	/* setDate(date) Method */
	$.fn.dp_calendar.setDate = function (date) {
		$.fn.dp_calendar({
			date_selected: date
		});
	};
	
	/* setDay(day) Method */
	$.fn.dp_calendar.setDay = function (day) {
		$.fn.dp_calendar({
			date_selected: new Date($.fn.dp_calendar.curr_year, $.fn.dp_calendar.curr_month, day)
		});
	};
	
	/* setMonth(month) Method */
	$.fn.dp_calendar.setMonth = function (month) {
		$.fn.dp_calendar({
			date_selected: new Date($.fn.dp_calendar.curr_year, month, $.fn.dp_calendar.curr_date)
		});
	};
	
	/* setYear(year) Method */
	$.fn.dp_calendar.setYear = function (year) {
		$.fn.dp_calendar({
			date_selected: new Date(year, $.fn.dp_calendar.curr_month, $.fn.dp_calendar.curr_date)
		});
	};
	
	/* getDate() Method */
	$.fn.dp_calendar.getDate = function () {
		return $.fn.dp_calendar.date_selected;
	};
	
	/* getDay() Method */
	$.fn.dp_calendar.getDay = function () {
		return $.fn.dp_calendar.curr_date;
	};
	
	/* getMonth() Method */
	$.fn.dp_calendar.getMonth = function () {
		return $.fn.dp_calendar.curr_month;
	};
	
	/* getYear() Method */
	$.fn.dp_calendar.getYear = function () {
		return $.fn.dp_calendar.curr_year;
	};

})(jQuery);