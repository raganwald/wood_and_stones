// (c) 2010 Reg Braithwaite. All rights to the entirety of the program and its parts are reserved with 
// the exception of specific files otherwise licensed. Other licenses apply only to the files where
// they appear.

;(function ($, undefined) {
	
	var validate = function (move) {
		
	};
	
	go.ui = {
		validate: validate
	};
			
	var initialize_ui_support = (function () {
		
		var do_undo = function (event) {
			var to_play;
			var was_playing;
			
			var this_index = go.sgf.current.length - 1;
			var penultimate_index = go.sgf.floor(go.sgf.current.length - 2);
			
			go.sgf.undoit($('.move.play .board'), go.sgf.current[this_index], go.sgf.current[penultimate_index]);
			
			go.sgf.current.pop();
			
		};
		
		var do_pass = function() {
			if (go.sgf.game_info['RE']) return;
			
			var to_play = go.playing();
			var was_playing = go.opponent();
			var was_playing_index = was_playing[0].toUpperCase();
			var last_move_index = go.sgf.floor(go.sgf.current.length - 1);
			
			var annotation = {};
			annotation[to_play[0].toUpperCase()] = '';
			
			var really_pass = function () {
				annotation['MN'] = (last_move_index >= 0 && go.sgf.current[last_move_index]['MN']) ? go.sgf.current[last_move_index]['MN']+ 1 : 1;

				go.sgf.current.push(annotation);
				go.sgf.doit($('.move.play .board'), annotation);
				$('.move.play .board .latest')
					.removeClass('latest');
			};
			
			if (last_move_index >= 0) {
				var last_move = go.sgf.current[last_move_index];
				var position = last_move[was_playing_index];
				if (position != undefined && (position == '' || !$('.move.play .board').has('#' + position))) {
					go.dialog
						.text("End the game with a second consecutive pass?")
						.dialog({
							title: "End Game",
							buttons: { 
								"Pass": function() { 
									do_pass();
									$(this).dialog("close");
								},
								"No":   function() { $(this).dialog("close"); } 
							}
						})
						.dialog('open');
				}
				else really_pass();
			}
			else really_pass();
		};
		
		var annotate = function (event_data, key) {
			target = $(event_data.currentTarget);
			if (!target.is('.intersection')) target = target.closest('.intersection');
			if (target.is('.black,.white')) console.error(target.attr('id') + ' is already occupied');
			var killed_stones = $('.move.play .intersection.'+go.opponent()+'.last_liberty_is_'+target.attr('id'));
			var annotation = {};
			annotation[key] = target.attr('id');
			if (killed_stones.size() > 0) {
				annotation['K'] = $.map(killed_stones, 'x -> $(x).attr("id")'.lambda()).join(',');
				killed_stones.removeClass(go.opponent());
			}
			var last_move_index = go.sgf.floor(go.sgf.current.length - 1);
			annotation['MN'] = (last_move_index >= 0 && go.sgf.current[last_move_index]['MN']) ? go.sgf.current[last_move_index]['MN'] + 1 : 1;
			go.sgf.current.push(annotation);
			go.sgf.doit($('.move.play .board'), annotation);
		};
		
		var do_play = function (event_data) {
			annotate(event_data, go.playing()[0].toUpperCase());
			return false;
		};
		
		var do_reject_swap = function (event_data) {
			var opponent_name = go.sgf.game_info['P' + go.opponent()[0].toUpperCase()];
			var player_name = go.sgf.game_info['P' + go.playing()[0].toUpperCase()];
			$('.move.play')
				.removeClass('swap');
			do_play(event_data);
			go.sgf.current[go.sgf.current.length - 1].C = player_name + " declines to swap places with " + opponent_name;
			return false;
		};
		
		var do_accept_swap = function (event_data) {
			var opponent_name = go.sgf.game_info['P' + go.opponent()[0].toUpperCase()];
			var player_name = go.sgf.game_info['P' + go.playing()[0].toUpperCase()];
			
			if (opponent_name.match(/white|black/i) || player_name.match(/white|black/i)) {
				go.message("Since you've decided to swap, it's your opponent's turn to play " + go.playing());
			}
			else {
				go.message("Since you've decided to swap, " + opponent_name + " will play " + go.playing() + ' (this changes PB and PW.)');
				go.sgf.game_info['P' + go.opponent()[0].toUpperCase()] = player_name;
				go.sgf.game_info['P' + go.playing()[0].toUpperCase()] = opponent_name;
			}
			go.sgf.current.push({ C: player_name + " swaps places with " + opponent_name });
			
			$('.move.play')
				.removeClass('swap');
				
			go.set_titles();
			return false;
		};
		
		var do_place = function (event_data) {
			annotate(event_data, 'AB');
			return false;
		}
		
		var zoomed_out_p = function() {
			return $('.board:last').is('.zoomout');
		};
			
		var remove_zoomout = function(selection) {
			return $(selection)
				.removeClass('zoomout')
				.unbind('.zoomout');
		};
	
		var remove_zoomin = function(selection) {
			return $(selection)
				.removeClass('zoomin')
				.unbind('.zoomin')
				.removedragscrollable();
		};
			
		var really_zoomout = function(selection) {
			return $(selection)
				.filter('.board:not(.zoomout)')
					.K(remove_zoomin)
					.addClass('zoomout');
		};
	
		var really_zoomin = function (target) {
			var across;
			var down;
			var board;
			if (typeof(target) == 'undefined') {
				across = 0;
				down = 0;
				board = null;
			}
			else {
				down = $(target)
					.closest('.row')
						.prevAll('.row')
							.size();
				across = $(target)
					.prevAll('.intersection')
						.size();
				board = $(target).closest('.board');
			}
			return function(selection) {
				$(selection)
					.filter('.board:not(.zoomin)')
						.K(remove_zoomout)
						.addClass('zoomin')
						.dragscrollable({ preventDefault: false });
				if (typeof(board) != 'undefined') {
					var new_target = (across == 0 && down == 0) ? null : board.find('.row:nth-child('+down+') .intersection:nth-child('+across+')');
					board
						.scrollLeft(across == 0 ? 0 : (new_target.width() * across) - (board.width() / 2)) // handles min and max for us
						.scrollTop(down == 0 ? 0 : (new_target.height() * down) - (board.height() / 2));
				}
			};
		};
				
		var do_zoomin = function(event) {
			$('.board')
				.K(really_zoomin(event.target));
			$(this)
				.children(':first')
					.trigger(event.gesture_data.originalEvent);
			return false;
		};
		
		var do_zoomout = function(event) {
			$('.board')
				.K(really_zoomout);
			return false;
		};
		
		var do_scale = function(event, data) {
			if (event.scale <= 0.75)
				$('.board')
					.K(really_zoomout);
			else if (event.scale >= 1.5)
				$('.board')
					.K(really_zoomin(event.target));
			return false;
		};
		
		var show_play_info = function (event) {
			var whites = 0;
			var blacks = 0;
			$.each(go.sgf.current, function (index, properties) {
				if (properties.W && properties.K)
					blacks = blacks + 1 + ((properties.K.length - 2) / 3);
				else if (properties.W && properties.K)
					whites = whites + 1 + ((properties.K.length - 2) / 3);
			});
			$('#info')
				.find('.captured_blacks')
					.text(blacks == 0 ? 'no stones' : (blacks == 1 ? 'one stone' : '' + blacks + ' stones'))
					.end()
				.find('.captured_whites')
					.text(whites == 0 ? 'no stones' : (whites == 1 ? 'one stone' : '' + whites + ' stones'))
					.end();
			jQT.goTo($('#info'), 'slideup.reverse');
			return false;
		};
		
		return function() {
			$('.move')
				.gesture([
					'bottom', 'close', 'click', 'hold', 'scale', 'left', 'right', 'circle', 'open',
					{ scrub: function(target) {
						return $(target)
							.parents('body > *')
								.find('.scrub');
							}
						}
				])
				.bind({
					turn:  function (event, data) {
						$('.board')
							.removeClass('portrait landscape')
							.addClass(data.orientation);
					}
				});
			$('.move.play:has(.zoomout)')
				.live('gesture_open', 
					function () {
						go.dialog
							.text("Start a new game from scratch?")
							.dialog({
								title: "New Game",
								buttons: { 
									"New Game": function() { 
										$(this).dialog("close");
										jQT.swapPages( $('.move.play'), $('#new'), 'dissolve');
									},
									"No":   function() { $(this).dialog("close"); } 
								}
							})
							.dialog('open');
					}
				);
										
			$('.board')
				.live('gesture_scale', do_scale)
				.addClass(
					window.orientation !== undefined 
						? (Math.abs(window.orientation) == 90 ? 'landscape' : 'profile')
						: (window.innerWidth < window.innerHeight ? 'profile' : 'landscape')
				);
				
			$('.board.zoomout')
				.live('gesture_hold', do_zoomin);
			$('.board.zoomin')
				.live('gesture_hold', do_zoomout);
				
			$('.move.play .board.pass.play:not(:has(.valid.black,.valid.white))')
				.live('gesture_close', do_pass);
			$('.move.play .board:not(.pass):not(:has(.valid.black,.valid.white))')
				.live('gesture_close', function () {go.message("Sorry, the rules prohibit passing at this time");});
				
			$('.move.play .board')
				.live('gesture_scrub', do_undo)
				.live('gesture_bottom', show_play_info);
				
			$('#info')
				.gesture(['top'])
				.bind('gesture_top', function(event) { jQT.goBack(); });
				
			$('.move.play:not(.swap) .board.play .valid')
				.live('gesture_click', do_play);
				
			$('.move.play.swap .board.play .valid')
				.live('gesture_click', do_reject_swap);
				
			$('.move.play.swap .board.play')
				.live('gesture_circle', do_accept_swap);
				
			$('.move.play .board.place .valid')
				.live('gesture_click', do_place);
		};
	})();
	
	go.on_document_ready(initialize_ui_support);
	
})(jQuery);