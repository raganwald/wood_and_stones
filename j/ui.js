// (c) 2010 Reg Braithwaite. All rights to the entirety of the program and its parts are reserved with 
// the exception of specific files otherwise licensed. Other licenses apply only to the files where
// they appear.

;(function ($, F, undefined) {
	
	var validate = function (move) {
		
	};
	
	go.ui = {
		validate: validate
	};
			
	var initialize_ui_support = (function () {
		
		var do_undo = function (event) {
			var last_move_index = go.sgf.floor(go.sgf.current.length - 1);
			var move_number = (last_move_index >= 0 && go.sgf.current[last_move_index]['MN']) ? go.sgf.current[last_move_index]['MN'] : 0;
			if (move_number > 0)
				go.sgf.pop();
			else go.message("It is not possible to undo the setup. Start a new game instead with a '+'.");
		};
		
		var do_pass = function() {
			if (go.sgf.game_info['RE']) return;
			
			var to_play = go.playing();
			var was_playing = go.opponent();
			var was_playing_index = was_playing[0].toUpperCase();
			var last_move_index = go.sgf.floor(go.sgf.current.length - 1);
			
			var really_pass = function () {
				var annotation = {};
				annotation[to_play[0].toUpperCase()] = '';
				annotation['MN'] = (last_move_index >= 0 && go.sgf.current[last_move_index]['MN']) ? go.sgf.current[last_move_index]['MN']+ 1 : 1;
				go.sgf.push(annotation);
			};
			
			if (last_move_index >= 0) {
				var last_move = go.sgf.current[last_move_index];
				var position = last_move[was_playing_index];
				if (position != undefined && (position == '' || !$('.move.play .board').has('#' + position))) {
					go.dialog({
						title: "End Game",
						message: "End the game with a second consecutive pass?",
						yes_button: "Pass",
						no_button: "No",
						yes_callback: really_pass
					});
				}
				else really_pass();
			}
			else really_pass();
		};
		
		var annotate = function (event_data, key, optional_extensions) {
			optional_extensions = optional_extensions || {};
			target = $(event_data.target);
			if (!target.is('.intersection')) target = target.closest('.intersection');
			if (target.is('.black,.white')) console.error(target.attr('id') + ' is already occupied');
			var killed_stones = $('.move.play .intersection.'+go.opponent()+'.last_liberty_is_'+target.attr('id'));
			
			var annotation = optional_extensions;
			annotation[key] = target.attr('id');
			if (killed_stones.size() > 0) {
				annotation['K'] = $.map(killed_stones, 'x -> $(x).attr("id")'.lambda()).join(',');
			}
			var last_move_index = go.sgf.floor(go.sgf.current.length - 1);
			annotation['MN'] = (last_move_index >= 0 && go.sgf.current[last_move_index]['MN']) ? go.sgf.current[last_move_index]['MN'] + 1 : 1;
			go.sgf.push(annotation);
		};
		
		var do_play = function (event_data, optional_extensions) {
			annotate(event_data, go.playing()[0].toUpperCase(), optional_extensions);
			return false;
		};
		
		var do_reject_swap = function (event_data) {
			var opponent_name = go.sgf.game_info['P' + go.opponent()[0].toUpperCase()];
			var player_name = go.sgf.game_info['P' + go.playing()[0].toUpperCase()];
			do_play(event_data, {
				C: player_name + " declines to swap places with " + opponent_name,
				PH: go.sgf.game_info.PH,
				PG: go.sgf.game_info.PG
			});
			return false;
		};
		
		var do_accept_swap = function (event_data) {
			var opponent_name = go.sgf.game_info['P' + go.opponent()[0].toUpperCase()];
			var player_name = go.sgf.game_info['P' + go.playing()[0].toUpperCase()];
			
			var swap_move;
			
			if (opponent_name.match(/white|black/i) || player_name.match(/white|black/i)) {
				if ($('body').is('landscape'))
					go.message("Since you've decided to swap, it's your opponent's turn to play " + go.playing());
				swap_move = {
					PH: go.sgf.game_info.PW,
					PG: go.sgf.game_info.PB
				};
			}
			else {
				if ($('body').is('landscape'))
					go.message("Since you've decided to swap, " + opponent_name + " will play " + go.playing());
				swap_move = {
					PB: go.sgf.game_info.PG,
					PW: go.sgf.game_info.PH
				};
			}
			$.extend(swap_move, { C: player_name + " swaps places with " + opponent_name });
			go.sgf.push(swap_move);
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
				// .find('.sgf')
				// 	.text(go.sgf.text())
				// 	.end()
			jQT.goTo($('#info'), 'slideup.reverse');
			return false;
		};
		
		return function() {
			$('.move.play')
				.gesture(['click', 'circle', 'close']);
			$('.move')
				.gesture([
					'bottom', 'hold', 'scale', 'left', 'right', 'open',
					{ scrub: function(target) {
						return $(target)
							.parents('body > *')
								.find('.scrub');
							}
						}
				]);
			$('.move.play:has(.zoomout)')
				.live('gesture_open', 
					function () {
						go.dialog({
							title: "New Game",
							message: "Start a new game from scratch?",
							yes_button: "New",
							yes_callback: function () { jQT.swapPages( $('.move.play'), $('#new'), 'dissolve'); }
						});
						return false;
					}
				);
										
			$('.board')
				.live('gesture_scale', do_scale);
				
			$('.board.zoomout')
				.live('gesture_hold', do_zoomin);
			$('.board.zoomin')
				.live('gesture_hold', do_zoomout);
				
			$('.move.play .board.pass:not(:has(.playable_black.black,.playable_white.white))')
				.live('gesture_close', do_pass);
				
			$('.move.play .board:not(.pass):not(:has(.playable_black.black,.playable_white.white))')
				.live('gesture_close', function () {go.message("Sorry, the rules prohibit passing at this time");});
				
			$('.move.play .board')
				.live('gesture_scrub', do_undo)
				.live('gesture_bottom', show_play_info);
				
			$('#info')
				.gesture(['top'])
				.bind('gesture_top', function(event) { jQT.goBack(); });
				
			$('.move.play.black:not(.swap) .board.play .playable_black')
				.live('gesture_click', do_play);
			$('.move.play.white:not(.swap) .board.play .playable_white')
				.live('gesture_click', do_play);
				
			$('.move.play.black .board.place .playable_black')
				.live('gesture_click', do_place);
			$('.move.play.white .board.place .playable_white')
				.live('gesture_click', do_place);
				
			$('.move.play.black.swap .board.play .playable_black')
				.live('gesture_click', do_reject_swap);
			$('.move.play.white.swap .board.play .playable_white')
				.live('gesture_click', do_reject_swap);
				
			$('.move.play.swap .board.play')
				.live('gesture_circle', do_accept_swap);
				
		};
	})();
	
	$(initialize_ui_support);
	
})(jQuery, Functional);