;(function ($) {
	$.fn.into = function (fn) {
		fn(this);
		return this;
	};
})(jQuery);

;(function ($) {
	
	var handler_maker = function (info, update_hey, set_played_stone, set_killed_stones) {
		
		var update_boards_with_navigation_handlers = (function () {
		
			var zoomed_out_p = function() {
				var dragger = $('.dragger');
				var board = $('.board');
				return dragger.outerHeight() <= board.innerHeight() && dragger.outerWidth() <= board.innerWidth();
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

			var do_zoomout = (function () {
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
							.clone(false)
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
						update_hey(this_move);
						this_move.insertBefore(next_move);
					}
					return $(selector);
				};
				var goto_move = function (from_move_number, to_move_number) {
					var from_page = $(select_move_by_move_number(from_move_number));
					var to_page = memoized_move(to_move_number);
					jQT.swapPages(from_page, to_page, ((from_move_number > to_move_number) ? 'slide.backwards' : 'slide'));
					return false;
				};
				var forwards_in_time = function (event) {
					var target = $(event.target);
					var current_move_number = current_displayed_move_number(target);
					if (current_move_number < last_displayed_move_number()) {
						return goto_move(current_move_number, current_move_number + 1);
					}
					else {
						position = position_of_played_stone();
						if (position != null) {
							play_stone(position);
						}
						else if (info.is_users_turn) {
							var text;
							if (info.game_state == 'passed') {
								text = 'Since ' + info.opponent + ' just passed, passing will end the game.';
							}
							else {
								text = 'If ' + info.opponent + ' passes, the game will end.';
							}
					    message_dialog_instance
								.text(text)
								.dialog({
									title: "Really pass?",
									buttons: { 
										"Pass": function() { 
											pass(function () { $(this).dialog("close"); });
										},
										"No": function() { $(this).dialog("close"); } 
									}
								})
								.dialog('open');
						}
						else {
							progress_dialog('open');
							$.get(
								info.plays_url, 
								{ after_play: info.move_number, layout: false },
								function (html) {
									process_update(html);
									progress_dialog('close');
								}
							);
							return true;
						}
						return false;
					}
				};
				var backwards_in_time = function (event) {
					var target = $(event.target);
					var current_move_number = current_displayed_move_number(target);
					if (current_move_number > 0) {
						return goto_move(current_move_number, current_move_number - 1);
					}
				};
				
				return function(selection) {
					return $(selection)
						.filter('.board:not(.zoomout)')
							.into(remove_zoomin)
							.addClass('zoomout')
							.bind({
								'gesture_left.zoomout': forwards_in_time,
								'gesture_right.zoomout': backwards_in_time
							})
				};
			})();
			
			var do_zoomin = function(selection) {
				return $(selection)
					.filter('.board:not(.zoomin)')
						.into(remove_zoomout)
						.addClass('zoomin')
						.dragscrollable();
			};
			
			var	handle_scaling = (function () {
				
				var toggle_zoom_and_mousedown = function (event) {
					var toggler = zoomed_out_p() ? do_zoomin : do_zoomout;
					$(this)
						.into(toggler)
						.children(':first')
							.trigger(event.gesture_data.originalEvent);
					return false;
				};
				
				return function (selection) {
					return $(selection)
						.filter('.board')
							.bind({
								'gesture_scale': function(event, data) {
									if (event.scale <= 0.75)
										do_zoomout();
									else if (event.scale >= 1.5)
										do_zoomin();
									return false;
								},
								'gesture_hold': toggle_zoom_and_mousedown
							});
				};
			})();
			
			var handle_clear_current_play = (function () {
				var clear_current_play = function (event) {
					var target = $(event.target);
					set_played_stone(target.find('.intersection.latest:not(.last)'), false);
					set_killed_stones(null, false)
				};
				return function(selection) {
					return $(selection)
						.filter('.board')
							.unbind('.clear_current_play')
							.bind('gesture_scrub.clear_current_play', clear_current_play);
				};
			})();
			
			var handle_show_game_info = (function () {
				var show_game_info = function (event) {
					jQT.goTo($('#info'), 'slideup.reverse');
				};
				return function(selection) {
					return $(selection)
						.filter('.board')
							.unbind('.show_game_info')
							.bind('gesture_bottom.show_game_info', show_game_info);
				};
			})();
	
			var initialize_zoom = function(selection) {
				var doer = zoomed_out_p() ? do_zoomout : do_zoomin;
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
								.into(handle_scaling)
								.into(handle_clear_current_play)
								.into(handle_show_game_info)
								.into(initialize_zoom);
			};
		
		})();
		
		return update_boards_with_navigation_handlers;
	
	};

	var initialize_gesture_support = function() {
		$('body')
			.gesture(['left', 'right', 'hold', 'scale']);
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
						initialize_gesture_support();
						old_document_ready_hook();
						$('.move')
							.into(update_boards_with_navigation_handlers);
					}
				});
			}
		})(GO.game_show_helper)
	});
})(jQuery);	