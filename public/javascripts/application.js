var GO = function () {
	return {
		message: function (title, text) {
      $('#message h1').text(title);
      $('.message').text(text);
      jQT.goTo($('#message'), 'pop');
		},
		submit: function(e, success, error) {
		  var $form = (typeof(e)==='string') ? $(e) : $(e.target);
		  $.ajax({
		      url: $form.attr('action'),
		      data: $form.serialize(),
		      type: $form.attr('method') || "POST",
		      success: success,
		      error: error
		  });
		},
		game_show_helper: function (info) {
			var NULL_SELECTOR = 'not(*)';
			var update_latest_server_info = null;
			var current_move_number = info.move_number;
			var latest_server_info = info;
			var can_process_server_info = true;

			var move_selector = function (move_number) {
			  return '#m' + move_number;
			};
			
			var position_of_played_stone = function () {
				var target = $('.board .empty.' + latest_server_info.playing);
				if (target.size() == 1) {
					return target.attr('id');
				}
				else return null;
			};
			
			var stone_has_been_legally_placed = function () {
				return latest_server_info.is_users_turn && ($('.board .empty.' + latest_server_info.playing).size() == 1);
			};
			
			var play_stone  = function (position) {
			  $.ajax({
			    url: info.create_move_f(position),
			    type: 'POST',
			    dataType: 'json',
			    success: update_latest_server_info,
			    error: function (error_response) {
			      GO.message('error', 'unable to place a stone at ' + position + ' because: ' + error_response.responseText);
			    },
			  });
			};
			
			var pass = function () {
			  $.ajax({
			    url: info.create_pass_url,
			    type: 'POST',
			    dataType: 'json',
			    success: update_latest_server_info,
			    error: function (error_response) {
			      GO.message('error', 'unable to pass because: ' + error_response.responseText);
			    },
			  });
			}
			
			var do_stone_move = function (dbl_click_event_data) {
				console.log('double clicking ' + target.attr('id'));
			  target = $(dbl_click_event_data.currentTarget);
			  if (target.hasClass('empty')) {
			    $.ajax({
			      url: info.create_move_f(target.attr('id')),
			      type: 'POST',
			      dataType: 'json',
			      success: update_latest_server_info,
			      error: function (error_response) {
			        GO.message('error', 'unable to place a stone at ' + position + ' because: ' + error_response.responseText);
			      },
			    });
			  }
			};
			var place_stone = function (click_event_data) {
			  target = $(click_event_data.currentTarget);
				console.log('placing a ' + latest_server_info.playing + ' stone at: ' + target.attr('id'));
			  if (target.hasClass('valid') ) {
			    $('.board .empty.' + latest_server_info.playing).removeClass(latest_server_info.playing);
			    target.addClass(latest_server_info.playing);
			  }
			};
			var lift_stone = function (click_event_data) {
			  target = $(click_event_data.currentTarget);
			  if (target.hasClass('empty') && target.hasClass(latest_server_info.playing)) {
			    target.removeClass(latest_server_info.playing);
					$('')
			  }
			};
			var update_active_div = function () {
			  var move_to_unbind_selector = '.move.active';
			  var places_to_unbind_selector = '.move.active .board .empty.valid';
			  return function (move_number) {
			    var move_to_bind_selector = (move_number != null ? move_selector(move_number) : NULL_SELECTOR);
			    var places_to_bind_selector = (move_number != null ? move_to_bind_selector + ' .board .empty.valid' : NULL_SELECTOR);
			    $(move_to_bind_selector).addClass('active');
			    $(places_to_bind_selector).toggle(place_stone, lift_stone).dblclick(do_stone_move);
			    $(places_to_unbind_selector).not(places_to_bind_selector).unbind('click').unbind('dblclick').removeClass(latest_server_info.playing);
			    $(move_to_unbind_selector).not(move_to_bind_selector).removeClass('active');
			  };
			}();
			var get_latest_moves = function (callback) {
			  $.ajax({
			    url: info.get_updates_f(current_move_number),
			    type: 'GET',
			    dataType: 'html',
			    success: function (html) {
			      update_moves = $(html).filter('.move');
			      if (update_moves.size() > 0) {
							update_moves.each(function (i, el) {
								$(el).data('move', current_move_number + i + 1);
							});
			        update_moves.insertAfter('#m' + current_move_number);
							update_elements_with_navigation_handlers(update_moves);
			        $(move_selector(current_move_number) + ' .history .next').show();
			        current_move_number = current_move_number + update_moves.size();
			        if (callback) {
			          callback(move_selector(current_move_number));
			        }
			      }
			    },
			    error: function (error_response) {
			      GO.message('error', 'unable to load the game history after ' + current_move_number + ' because: ' + error_response.responseText);
			    }
			  });
			};
			var process_server_info = function () {
		    if (!can_process_server_info) {
					console.log('skipping process_server_info, probably waiting for ajax');
		      return null;
		    }
		    else if (!latest_server_info.move_number) {
					console.error('unable to process server info because there is no latest_server_info.move_number');
		      return null;
		    }
		    can_process_server_info = false;
		    if (latest_server_info.move_number > current_move_number) {
		      var was_current_move_number = current_move_number;
					console.log('requesting updates for moves from ' + was_current_move_number + ' to ' + latest_server_info.move_number);
		      if (latest_server_info.is_users_turn) {
		        get_latest_moves(function (latest_move_selector) { // updates current_move_number
		          update_active_div(latest_server_info.move_number);
		          update_status_on_current_board();
		          can_process_server_info = true;
		          if ($(move_selector(was_current_move_number)).is('.current')) {
								console.log('fading from ' + was_current_move_number + ' to ' + current_move_number);
		            jQT.goTo($(latest_move_selector), 'fade');
		          }
		        });
		      }
		      else {
		        get_latest_moves(function (latest_move_selector) { // updates current_move_number
		          update_active_div();
		          update_status_on_current_board();
		          can_process_server_info = true;
		          if ($(move_selector(was_current_move_number)).is('.current')) {
								console.log('fading from ' + was_current_move_number + ' to ' + current_move_number);
		            jQT.goTo($(latest_move_selector), 'fade');
		          }
		        });
		      }
		    }
		    else {
					console.log('i think i am up to date');
		      update_active_on_current_board();
		      can_process_server_info = true;
		    }
		  };
			var get_history_up_to = function (current_move_number) {
				if (current_move_number > 1) {
				  $.ajax({
				    url: info.get_history_f(current_move_number),
				    type: 'GET',
				    dataType: 'html',
				    success: function (html) {
			      	update_moves = $(html).filter('.move');
			      	if (update_moves.size() > 0) {
								update_moves.each(function (i, el) {
									$(el).data('move', i + 1);
								});
				      	update_moves.insertAfter('#m0');
								update_elements_with_navigation_handlers(update_moves);
							}
				      $(move_selector(current_move_number) + ' .history .prev').show();
				    },
				    error: function (error_response) {
				      console.error('unable to load the game history before ' + current_move_number + ' because: ' + error_response.responseText);
				    }
				  });
				}
				else {
					$(move_selector(current_move_number) + ' .history .prev').show();
				}
			};
			var update_latest_server_info = function () {
		    if (!can_process_server_info) {
					console.log('skipping update_latest_server_info, probably waiting for ajax');
		      return null;
		    }
			  $.ajax({
			    url: info.move_info_url,
			    type: 'GET',
			    dataType: 'json',
			    success: function (data) {
			      latest_server_info = data;
			    },
			    error: function (error_response) {
			      console.error('unable to update_latest_server_info because: ' + error_response.responseText);
			    }
			  });
			};
			var update_active_on_current_board = function () {
			  if (latest_server_info.is_users_turn) {
			    update_active_div(latest_server_info.move_number);
			  }
			  else {
			    update_active_div();
			  }
			};
			var update_status_on_current_board = function () {
				var selector = move_selector(current_move_number);
				if (current_move_number > 0) {
					$(selector).find('.info .desc').addClass('current').text('current position.');
					$('.move').not(selector).has('.info .desc.current').each(function (move_el) {
						$(move_el).find('.info .desc.current').removeClass('current').text('position after move' + $(move_el).data('move') + '.');
					});
				}
				var news_text = '';
				if (latest_server_info.playing) {
					if (latest_server_info.is_users_turn) {
						news_text = 'Thus, it is your turn.';
					}
					else if (latest_server_info.playing == 'black') {
						news_text = 'Thus, you are waiting for white to play or pass.';
					}
					else {
						news_text = 'Thus, you are waiting for black to play or pass.';
					}
				}
				else if (latest_server_info.move_number == 0) {
					news_text = news_text + 'It is ' + latest_server_info.to_play + "'s turn.";
				}
				$(selector).find('.info .news').text(news_text);
			};

			var update_elements_with_navigation_handlers = function () {
				var try_go_to = function (selector, animation) {
					console.log('trying to go to ' + selector);
					if ($(selector).size() > 0) {
						jQT.goTo(selector, animation);
					}
				};
				var swipeBoardLeft = function (target) {
					console.log("swiping left from " + $(target).parents('.move').attr('id'));
					var tm = $(target).parents('.move').data('move');
					if (tm != null) {
						if (tm < latest_server_info.move_number) {
							try_go_to(move_selector(tm + 1), ''); // slide seems to work
						}
						else {
							position = position_of_played_stone();
							if (position != null) {
								play_stone(position);
							}
							else if (latest_server_info.is_users_turn) {
								pass();
							}
							else {
								GO.message('Sorry', 'It is not your turn to play or pass');
							}
						}
					}
				};
				var swipeBoardRight = function (target) {
					console.log("swiping right from " + $(target).parents('.move').attr('id') + ' which has a move number of ' +  $(target).parents('.move').data('move'));
					var tm = $(target).parents('.move').data('move');
					if (tm != null && tm > 0) {
						try_go_to(move_selector(tm - 1), ''); // slideback  seems unreliable
					}
				};
				var swiper = function(event, data){
		      if (data.direction == 'left') {
		        swipeBoardLeft(event.currentTarget);
		        return false;
		      }
		      else {
		        swipeBoardRight(event.currentTarget);
		        return false;
		      }
		    };
				var lefty = function (event) {
		      swipeBoardLeft(event.currentTarget);
		      return false;
		    };
				var rightho = function (event) {
		      swipeBoardRight(event.currentTarget);
		      return false;
		    };
				return function (selector) {
					elements = $(selector).find('*');
					if (elements.size() == 0) {
						console.warn("unable to update navigation: no elements for " + selector);
					}
					// elements.filter('.board img').unbind('swipe.navigation', swiper);
					// 			    elements.filter('.simulateSwipeBoardLeft').unbind('click.navigation', lefty);
					// 			    elements.filter('.simulateSwipeBoardRight').unbind('click.navigation', rightho);
					elements.filter('.board img').bind('swipe.navigation', swiper);
			    elements.filter('.simulateSwipeBoardLeft').bind('click.navigation', lefty);
			    elements.filter('.simulateSwipeBoardRight').bind('click.navigation', rightho);
	        if ($.support.touch) {
	          elements.filter('.no_touch').remove();
	        }
				};
			}();
			
			var document_ready_hook = function () {
		    update_elements_with_navigation_handlers('body');
			};
			
			return {
				  update_status_on_current_board: update_status_on_current_board,
				  update_active_on_current_board: update_active_on_current_board,
				  process_server_info: process_server_info,
				  get_history_up_to: get_history_up_to,
				  update_latest_server_info: update_latest_server_info,
					document_ready_hook: document_ready_hook,
					debug: {
						info: function () { return info; },
						latest_server_info: function () { return latest_server_info; },
					}
			};
		}
	};
}();