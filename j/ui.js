// (c) 2010 Reg Braithwaite. All rights to the entirety of the program and its parts are reserved with 
// the exception of specific files otherwise licensed. Other licenses apply only to the files where
// they appear.

;(function ($, undefined) {
	
	var validate = function (move) {
		
	};
	
	go.ui = {
		validate: validate
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
			.into(go.referee.validate);
	};
			
	var initialize_ui_support = (function () {
		
		var do_undo = function (event) {
			var to_play;
			var was_playing;
			
			var this_index = go.sgf.current.length - 1;
			var penultimate_index = go.sgf.floor(go.sgf.current.length - 2);
			
			go.sgf.undoit($('.move.play .board'), go.sgf.current[this_index], go.sgf.current[penultimate_index]);
			
			go.sgf.current.pop();
			
			if (go.sgf.game_info['RE'])
				go.sgf.game_info['RE'] = null;
			switch_turns(was_playing);
			
		};
		
		var do_pass = function() {
			if (go.sgf.game_info['RE']) return;
			
			var to_play = playing();
			var was_playing = opponent();
			var was_playing_index = was_playing[0].toUpperCase();
			var last_move_index = go.sgf.floor(go.sgf.current.length - 1);
			
			var annotation = {};
			annotation[to_play[0].toUpperCase()] = '';
			
			if (last_move_index >= 0) {
				var last_move = go.sgf.current[last_move_index];
				var position = last_move[was_playing_index];
				if (position != undefined && (position == '' || !$('.move.play .board').has('#' + position))) {
					var end_game_p = confirm('end the game?');
					if (!end_game_p) return;
				}
			}
			annotation['MN'] = (last_move_index >= 0 && go.sgf.current[last_move_index]['MN']) ? go.sgf.current[last_move_index]['MN']+ 1 : 1;

			go.sgf.current.push(annotation);
			go.sgf.doit($('.move.play .board'), annotation);
			$('.move.play .board .latest')
				.removeClass('latest');
			switch_turns();
		};
		
		var do_play = function (event_data) {
			
			target = $(event_data.currentTarget);
			var now_playing = playing();
			if (!target.is('.intersection')) target = target.closest('.intersection');
			if (target.is('.black,.white')) console.error(target.attr('id') + ' is already occupied');
			var killed_stones = $('.move.play .intersection.'+opponent()+'.last_liberty_is_'+target.attr('id'));
			var annotation = {};
			annotation[now_playing[0].toUpperCase()] = target.attr('id');
			if (killed_stones.size() > 0) {
				annotation['K'] = $.map(killed_stones, 'x -> $(x).attr("id")'.lambda()).join(',');
				killed_stones.removeClass(opponent());
			}
			var last_move_index = go.sgf.floor(go.sgf.current.length - 1);
			annotation['MN'] = (last_move_index >= 0 && go.sgf.current[last_move_index]['MN']) ? go.sgf.current[last_move_index]['MN'] + 1 : 1;
			go.sgf.current.push(annotation);
			
			go.sgf.doit($('.move.play .board'), annotation);
		
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
					'bottom', 'close', 'click', 'hold', 'scale', 'left', 'right',
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
				.live('gesture_close', do_pass);
			$('.move.play .board')
				.live('gesture_scrub', do_undo)
				.live('gesture_bottom', show_play_info);
			$('#info')
				.gesture(['top'])
				.bind('gesture_top', function(event) { jQT.goBack(); });
			$('.move.play .board .valid')
				.live('gesture_click', do_play);
		};
	})();
	
	go.on_document_ready(initialize_ui_support);
	
})(jQuery);