;(function ($) {
	$.fn.into = function (fn) {
		fn(this);
		return this;
	};
})(jQuery);

;(function ($) {
		
	var zoomed_out_p = function() {
		return $('.board:first').is('.zoomout');
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
			down = parseInt(
				/down_([0-9]+)/
					.exec(
						$(target)
							.closest('.row')
								.attr('class')
					)[1]
			);
			across = parseInt(
				/across_([0-9]+)/
					.exec(
						$(target)
							.attr('class')
					)[1]
			);
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
	
	var handler_maker = function (info, update_hey, set_played_stone, set_killed_stones) {
		
		var update_boards_with_navigation_handlers = (function () {
	
			var initialize_zoom = function(selection) {
				
				var doer = zoomed_out_p() ? do_zoomout : zoomin_maker();
				
				return $(selection)
					.filter('.board')
						.into(remove_zoomout)
						.into(remove_zoomin)
						.into(doer);
			};

			return function (selection) {
				$(selection)
					.find('.board')
						.andSelf()
							.filter('.board')
								.addClass('scrub')
								.into(initialize_zoom);
			};
		
		})();
		
		return update_boards_with_navigation_handlers;
	
	};

	var initialize_gesture_support = function (update_boards_with_navigation_handlers, update_hey) {
			
		var id_by_move_number = function (move_number) {
		  return 'm' + move_number;
		};

		var select_move_by_move_number = function (move_number) {
		  return '#' + id_by_move_number(move_number);
		};
	
		var current_displayed_move_number = function (target) {
			return $(target).parents('.move').data('number');
		};
	
		var last_displayed_move_number = function () {
			return $('.move:last').data('number');
		};

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
		
		var goto_move = function (from_move_number, to_move_number) {
			var from_page = $(select_move_by_move_number(from_move_number));
			var to_page = memoized_move(to_move_number);
			jQT.swapPages(from_page, to_page, ((from_move_number > to_move_number) ? 'slide.backwards' : 'slide'));
			return false;
		};
		
		// break the specifics of making a play, making a pass, and polling for an update
		// out into GO functions and call them.
		
		// also, let's SERIOUSLY rethink overloading RIGHT. We also have ok
		
		var forwards_in_time = function (event) {
			var target = $(event.target);
			// work around distinction between selection and predicate behaviour
			var current_move_number = current_displayed_move_number(target);
			if (current_move_number < last_displayed_move_number()) {
				goto_move(current_move_number, current_move_number + 1);
				return false;
			}
		};
		
		var backwards_in_time = function (event) {
			var target = $(event.target);
			var current_move_number = current_displayed_move_number(target);
			// work around distinction between selection and predicate behaviour
			if (current_move_number > 0) {
				goto_move(current_move_number, current_move_number - 1);
				return false;
			}
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
		
		var show_game_info = function (event) {
			jQT.goTo($('#info'), 'slideup.reverse');
			return false;
		};
		
		$('body')
			.gesture(['left', 'right', 'hold', 'scale']);
		$('.board')
			.live('gesture_hold', toggle_zoom_and_mousedown)
			.live('gesture_scale', do_scale)
			.live('gesture_bottom', show_game_info);
		$('.board.zoomout') // $('.board.zoomout:not(.board:last)')
			.live('gesture_left', forwards_in_time)
			.live('gesture_right', backwards_in_time);
		
	};
	
	GO = $.extend(GO, {
		game_show_helper: (function (old_game_show_helper) {
			return function (info) {
				var game_show_helper = old_game_show_helper(info);
				var old_document_ready_hook = game_show_helper.document_ready_hook;
				var update_boards_with_navigation_handlers = handler_maker( 
					info, 
					game_show_helper.update_hey, 
					game_show_helper.set_played_stone,
					game_show_helper.set_killed_stones
				);
				return $.extend(game_show_helper, {
					document_ready_hook: function () {
						initialize_gesture_support(update_boards_with_navigation_handlers, game_show_helper.update_hey);
						old_document_ready_hook();
						$('.move')
							.into(update_boards_with_navigation_handlers);
					}
				});
			}
		})(GO.game_show_helper)
	});
})(jQuery);	