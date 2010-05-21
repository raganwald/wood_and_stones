;(function ($, undefined) {
	
	var intialize_move = function (move) {
		
	};
	
	go.ui = {
		intialize_move: intialize_move
	};
	
	var playing = function () {
		return $('.move:last').is('.black') ? 'black' : (
			$('.move:last').is('.white') ? 'white' : null
		);
	};
	
	var opponent = function () {
		return $('.move:last').is('.white') ? 'black' : (
			$('.move:last').is('.black') ? 'white' : null
		);
	};
	
	var switch_turns = function(new_player) {
		if (new_player == undefined) new_player = opponent();
		$('.move:last')
			.addClass(new_player)
			.removeClass(new_player == 'white' ? 'black' : 'white')
			.into(go.referee.intialize_move);
	};
			
	var initialize_gesture_support = (function () {
		
		var do_undo = function (event) {
			var to_play;
			var was_playing;
			var last_move = go.sgf.current[go.sgf.current.length - 1];
			if (last_move['B'] != undefined) {
				to_play = 'white';
				was_playing = 'black';
			}
			else if (last_move['W'] != undefined) {
				to_play = 'black';
				was_playing = 'white';
			}
			else return; // not undoable
			var was_playing_index = was_playing[0].toUpperCase();
			if (last_move != undefined) {
				var position = last_move[was_playing_index];
				if (position != undefined) {
					if (position) {
						$('.move:last .board #' + position)
							.removeClass('latest')
							.removeClass(was_playing);
						var m = last_move['C'] && last_move['C'].match(/killed: (..(?:,..)*)/);
						if (m != undefined) {
							$('.move:last .board')
								.find($.map(m[1].split(','), '"#" + _'.lambda()).join(','))
									.addClass(was_playing == 'black' ? 'white' : 'black');
						}
					}
					go.sgf.current.pop();
					var penultimate_move = go.sgf.current[go.sgf.current.length - 1];
					var to_play_index = to_play[0].toUpperCase();
					if (penultimate_move != undefined) {
						var previous_position = penultimate_move[to_play_index];
						if (previous_position)
							$('.move:last .board #' + previous_position)
								.addClass('latest');
					}
					if (go.sgf.game_info['R'])
						go.sgf.game_info['R'] = null;
					switch_turns(was_playing);
				}
			}
		};
		
		var do_pass = function() {
			if (go.sgf.game_info['R']) return;
			
			var to_play = playing();
			var was_playing = opponent();
			var was_playing_index = was_playing[0].toUpperCase();
			var last_move = go.sgf.current[go.sgf.current.length - 1];
			
			var annotation = {};
			annotation[to_play[0].toUpperCase()] = '';
			go.sgf.current.push(annotation);
			
			if (last_move != undefined) {
				var position = last_move[was_playing_index];
				if (position != undefined && !position) {
					alert('this pass ends the game!');
					go.sgf.game_info['R'] = 'Two passes';
					$('.move:last')
						.removeClass(to_play);
					return;
				}
			}
			$('.move:last .board .latest')
				.removeClass('latest');
			switch_turns();
		};
		
		var do_play = function (event_data) {
			if (go.sgf.game_info['R']) return;
			
			target = $(event_data.currentTarget);
			var now_playing = playing();
			if (!target.is('.intersection')) target = target.closest('.intersection');
			if (target.is('.black,.white')) console.error(target.attr('id') + ' is already occupied');
			target
				.closest('.board')
					.find('.latest')
						.removeClass('latest')
						.end()
					.end()
				.addClass('latest')
				.addClass(now_playing);
			var killed_stones = $('.move:last .intersection.killed_by_'+target.attr('id'));
			var annotation = {};
			annotation[now_playing[0].toUpperCase()] = target.attr('id');
			if (killed_stones.size() > 0) {
				annotation['C'] = 'killed: ' + $.map(killed_stones, 'x -> $(x).attr("id")'.lambda()).join(',');
				killed_stones.removeClass(opponent());
			}
			var last_move = go.sgf.current[go.sgf.current.length - 1];
			if (last_move['MN'] != undefined) annotation['MN'] = last_move['MN'] + 1;
			go.sgf.current.push(annotation);
		
			switch_turns();
		};
		
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
			
		var do_zoomout = function(selection) {
			return $(selection)
				.filter('.board:not(.zoomout)')
					.into(remove_zoomin)
					.addClass('zoomout');
		};
	
		var zoomin_maker = function (target) {
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
						.into(remove_zoomout)
						.addClass('zoomin')
						.dragscrollable({ preventDefault: false });
				if (typeof(board) != 'undefined') {
					var new_target = (across == 0 && down == 0) ? null : board.find('.down_'+down + ' .across_'+across);
					board
						.scrollLeft(across == 0 ? 0 : (new_target.width() * across) - (board.width() / 2)) // handles min and max for us
						.scrollTop(down == 0 ? 0 : (new_target.height() * down) - (board.height() / 2));
				}
			};
		};
				
		var toggle_zoom_and_mousedown = function (event) {
			$('.board')
				.into(zoomed_out_p() ? zoomin_maker(event.target) : do_zoomout);
			$(this)
				.children(':first')
					.trigger(event.gesture_data.originalEvent);
			return false;
		};
		
		var do_scale = function(event, data) {
			if (event.scale <= 0.75)
				$('.board')
					.into(do_zoomout);
			else if (event.scale >= 1.5)
				$('.board')
					.into(zoomin_maker(event.target));
			return false;
		};
		
		return function() {
			$('.move')
				.gesture([
					'bottom', 'circle', 'click', 'hold', 'scale',
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
			$('.board')
				.live('gesture_hold', toggle_zoom_and_mousedown)
				.live('gesture_scale', do_scale)
				.addClass(
					window.orientation !== undefined 
						? (Math.abs(window.orientation) == 90 ? 'landscape' : 'profile')
						: (window.innerWidth < window.innerHeight ? 'profile' : 'landscape')
				);
			$('.move:last .board:not(:has(.valid.black,.valid.white))')
				.live('gesture_circle', do_pass);
			$('.move:last .board')
				.live('gesture_scrub', do_undo);
			$('#info')
				.bind('gesture_top', function(event) { jQT.goBack(); });
			$('.move:last .board .valid')
				.live('gesture_click', do_play);
		};
	})();
	
	go.on_document_ready(initialize_gesture_support);
	
})(jQuery);