// (c) 2010 Reg Braithwaite. All rights to the entirety of the program and its parts are reserved with 
// the exception of specific files otherwise licensed. Other licenses apply only to the files where
// they appear.

;(function ($, undefined) {
	
	var intialize_move = function (move) {
		
	};
	
	go.ui = {
		intialize_move: intialize_move
	};
	
	var playing = function () {
		return $('.move.play').is('.black') ? 'black' : (
			$('.move.play').is('.white') ? 'white' : null
		);
	};
	
	var opponent = function () {
		return $('.move.play').is('.white') ? 'black' : (
			$('.move.play').is('.black') ? 'white' : null
		);
	};
	
	var switch_turns = function(new_player) {
		if (new_player == undefined) new_player = opponent();
		$('.move.play')
			.addClass(new_player)
			.removeClass(new_player == 'white' ? 'black' : 'white')
			.into(go.referee.intialize_move);
	};
			
	var initialize_ui_support = (function () {
		
		var do_undo = function (event) {
			var to_play;
			var was_playing;
			
			var this_index = go.sgf.current.length - 1;
			var penultimate_index = go.sgf.floor(go.sgf.current.length - 2);
			
			go.sgf.undoit($('.move.play .board'), go.sgf.current[this_index], go.sgf.current[penultimate_index]);
			
			go.sgf.current.pop();
			
			if (go.sgf.game_info['R'])
				go.sgf.game_info['R'] = null;
			switch_turns(was_playing);
			
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
					$('.move.play')
						.removeClass(to_play);
					return;
				}
			}
			$('.move.play .board .latest')
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
			var killed_stones = $('.move.play .intersection.killed_by_'+target.attr('id'));
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
					'bottom', 'circle', 'click', 'hold', 'scale', 'left', 'right',
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
			$('.move.play .board:not(:has(.valid.black,.valid.white))')
				.live('gesture_circle', do_pass);
			$('.move.play .board')
				.live('gesture_scrub', do_undo);
			$('#info')
				.bind('gesture_top', function(event) { jQT.goBack(); });
			$('.move.play .board .valid')
				.live('gesture_click', do_play);
		};
	})();
	
	go.on_document_ready(initialize_ui_support);
	
})(jQuery);