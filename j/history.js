// (c) 2010 Reg Braithwaite. All rights to the entirety of the program and its parts are reserved with 
// the exception of specific files otherwise licensed. Other licenses apply only to the files where
// they appear.

;(function ($, undefined) {
	
	var fix_index = function(index) {
		while (index >= 0 && !go.sgf.current[index]['MN']) {
			--index;
		}
		return index;
	};
	
	var last_move_index = function () {
		return fix_index(go.sgf.current.length-1);
	};
	
	var this_history_index = function () {
		return $('.move.history.this .board')
			.data('index');
	}
	
	var goto_move = (function () {
		
		var memoized_move = function (target_move_number) {
			var selector = select_move_by_move_number(target_move_number);
			if ($(selector).size() == 0) {
				var move_data = $('body').data('moves')[target_move_number];
				var next_move = memoized_move(target_move_number + 1);
				var this_move = next_move
					.clone(true)
					.removeClass()
					.addClass('move')
					.attr('id', id_by_move_number(target_move_number))
					.data('number', target_move_number)
					.data('player', move_data.player)
					.data('position', move_data.position)
					.data('removed', move_data.removed)
					.find('.toolbar h1 .playing')
						.text('Move ' + target_move_number)
						.removeClass()
						.addClass('playing')
						.end()
					.find('.board .valid')
						.removeClass('valid')
						.end()
					.find('h1 .gravatar')
						.empty()
						.end()
					.find('.toolbar #heyButton')
						.attr('src', '/images/tools/empty-text-green.png')
						.end()
				var hey = this_move
					.find('.hey')
						.empty();
				var position = next_move.data('position');
				if (position && position != '') {
					this_move
						.find('#' + position + '.intersection')
						.removeClass(next_move.data('player'))
						.addClass('empty');
					var other_player = next_move.data('player') =='black' ? 'white' : 'black';
					var removed_selector = $.map(next_move.data('removed'), function (pos) { 
						return '#' + pos + '.intersection'; 
					}).join(', ');
					this_move
						.find(removed_selector)
							.removeClass('empty')
							.addClass(other_player);
				}
				var last_position = this_move.data('position');
				if (last_position && last_position != '') {
					this_move
						.find('#' + last_position + '.intersection')
							.addClass('last latest');
					if (this_move.data('removed').length > 0) {
						hey.text(this_move.data('player')+ ' captured ' + this_move.data('removed').length + ' stones.');
							// TODO: capitalize and pluralize
					}
				}
				else {
					hey.text(this_move.data('player') + ' passed.'); // TODO: Titleize
				}
				this_move
					.into(update_boards_with_navigation_handlers)
					.into(update_hey)
					.insertBefore(next_move);
			}
			return $(selector);
		};
		
		return function (from_move_number, to_move_number) {
			var from_page = $(select_move_by_move_number(from_move_number));
			var to_page = memoized_move(to_move_number);
			jQT.swapPages(from_page, to_page, ((from_move_number > to_move_number) ? 'slide.backwards' : 'slide'));
			return false;
		};
	})();
	
	var forwards_in_history = function (event) {
		console.errors('Implement me');
	};
	
	var backwards_in_history = function (event) {
		
		var this_page = $('.move.history.this');
		var that_page = $('.move.history.that');
		
		var this_index = $('.move.history.this .board')
			.data('index');
		var that_index = fix_index(this_index - 1);
		if (that_index == -1) return; // may be a fencepost error when dealing with the start position
		
		console.log('!');
		
		$('.move.history.that .board')
			.empty()
			.append(
				$('.move.history.this .board')
					.children()
						.clone(false)
			)
			.data('index', that_index);
			
		var this_move = go.sgf.current[this_index];
		if (this_move['B'] != undefined) {
			to_play = 'white';
			was_playing = 'black';
		}
		else if (this_move['W'] != undefined) {
			to_play = 'black';
			was_playing = 'white';
		}
		else return; // not undoable
		var was_playing_index = was_playing[0].toUpperCase();
		if (this_move != undefined) {
			var position = this_move[was_playing_index];
			if (position != undefined) {
				if (position) {
					$('.move.history.that .board #' + position)
						.removeClass('latest')
						.removeClass(was_playing);
					var m = this_move['C'] && this_move['C'].match(/killed: (..(?:,..)*)/);
					if (m != undefined) {
						$('.move.history.that .board')
							.find($.map(m[1].split(','), '"#" + _'.lambda()).join(','))
								.addClass(was_playing == 'black' ? 'white' : 'black');
					}
				}
				var penultimate_move = go.sgf.current[that_index];
				var to_play_index = to_play[0].toUpperCase();
				if (penultimate_move != undefined) {
					var previous_position = penultimate_move[to_play_index];
					if (previous_position)
						$('.move.history.that .board #' + previous_position)
							.addClass('latest');
				}
			// TODO: Deal with titles
			}
		}
		
		this_page
			.addClass('that')
			.removeClass('this');
		that_page
			.addClass('this')
			.removeClass('that');
		
		jQT.swapPages(this_page, that_page, 'slide.backwards');
	};
	
	var enter_history = function() {
		$('.move.history.this .board')
			.empty()
			.append(
				$('.move.play .board')
					.children()
						.clone(false)
			)
			.data('index', last_move_index());
		jQT.swapPages($('.move.play'), $('.move.history.this'), '');
		backwards_in_history();
	}
	
	var initialize_history_support = function() {
		$('.move.play .board.zoomout')
			.live('gesture_right', enter_history);
		$('.move.history.this .board.zoomout')
			.live('gesture_left', forwards_in_history)
			.live('gesture_right', backwards_in_history);
	};
	
	go.on_document_ready(initialize_history_support);
	
})(jQuery);