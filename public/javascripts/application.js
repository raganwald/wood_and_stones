var GO = function () {
	return {
		message: function (title, text) {
      $('#message h1').text(title);
      $('.message').text(text);
      jQT.goTo($('#message'), 'flip');
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

			var move_selector = function (move_number) {
			  return '#m' + move_number;
			};
			var send_move = function (position) {
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
			var do_stone_move = function (dbl_click_event_data) {
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
			  if (target.hasClass('valid') ) {
			    $('.active .board .empty.' + latest_server_info.user_is_playing).removeClass(latest_server_info.user_is_playing);
			    target.addClass(latest_server_info.user_is_playing);
			  }
			};
			var lift_stone = function (click_event_data) {
			  target = $(click_event_data.currentTarget);
			  if (target.hasClass('empty') && target.hasClass(latest_server_info.user_is_playing)) {
			    target.removeClass(latest_server_info.user_is_playing);
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
			    $(places_to_unbind_selector).not(places_to_bind_selector).unbind('click').unbind('dblclick').removeClass(latest_server_info.user_is_playing);
			    $(move_to_unbind_selector).not(move_to_bind_selector).removeClass('active');
			  };
			}();
			var get_latest_moves = function (callback) {
			  $.ajax({
			    url: info.get_updates_f(current_move_number),
			    type: 'GET',
			    dataType: 'html',
			    success: function (html) {
			      update_moves = $(html);
			      if (update_moves.size() > 0) {
							$.each(update_moves, function (index, el) {
								$(el).data('move', index + current_move_number + 1);
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
			  var can_process_server_info = true;
			  return function () {
			    if (!can_process_server_info || !latest_server_info.move_number) {
			      return null;
			    }
			    can_process_server_info = false;
			    if (latest_server_info.move_number > current_move_number) {
			      var was_current_move_number = current_move_number;
			      if (latest_server_info.is_users_turn) {
			        get_latest_moves(function (latest_move_selector) {
			          update_active_div(latest_server_info.move_number);
			          update_status_on_current_board();
			          can_process_server_info = true;
			          if ($(move_selector(was_current_move_number)).is('.current')) {
			            jQT.goTo(latest_move_selector, 'flip');
			          }
			        });
			      }
			      else {
			        get_latest_moves(function (latest_move_selector) {
			          update_active_div();
			          update_status_on_current_board();
			          can_process_server_info = true;
			          if ($(move_selector(was_current_move_number)).is('.current')) {
			            jQT.goTo(latest_move_selector, 'flip');
			          }
			        });
			      }
			    }
			    else {
			      update_active_on_current_board();
			      can_process_server_info = true;
			    }
			  }
			}();
			var get_history_up_to = function (current_move_number) {
				if (current_move_number > 1) {
				  $.ajax({
				    url: info.get_history_f(current_move_number),
				    type: 'GET',
				    dataType: 'html',
				    success: function (html) {
			      	update_moves = $(html);
			      	if (update_moves.size() > 0) {
								$.each(update_moves, function (index, el) {
									$(el).data('move', index + 1);
									update_elements_with_navigation_handlers(el);
								});
				      	update_moves.insertAfter('#m0');
								update_elements_with_navigation_handlers(update_moves);
							}
				      $(move_selector(current_move_number) + ' .history .prev').show();
				    },
				    error: function (error_response) {
				      GO.message('error', 'unable to load the game history before ' + current_move_number + ' because: ' + error_response.responseText);
				    }
				  });
				}
				else {
					$(move_selector(current_move_number) + ' .history .prev').show();
				}
			};
			var update_latest_server_info = function () {
			  $.ajax({
			    url: info.move_info_url,
			    type: 'GET',
			    dataType: 'json',
			    success: function (data) {
			      latest_server_info = data;
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
			  $('.move .info').not(selector).hide();
			  $(selector + ' .info').show();
				var info_text = 'This is the current position.';
				if (latest_server_info.playing) {
					info_text = info_text + ' You are playing ' + latest_server_info.playing + ', and ';
					if (latest_server_info.is_users_turn) {
						info_text = info_text + 'it is your turn to play or pass.';
					}
					else {
						info_text = info_text + 'you are waiting for your opponent to play or pass.';
					}
				}
			  $(selector + ' .info p').text(info_text);
			};

			var try_go_to = function (selector, animation) {
				if ($(selector).size() > 0) {
					jQT.goTo(selector, animation);
				}
			};
			var swipeBoardLeft = function () {
				var tm = $('.current').data('move');
				if (tm != null) {
					try_go_to(move_selector(tm + 1));
				}
			};
			var swipeBoardRight = function () {
				var tm = $('.current').data('move');
				if (tm!= null && tm > 0) {
					try_go_to(move_selector(tm - 1));
				}
			};
			
			var update_elements_with_navigation_handlers = function (selector) {
				elements = $(selector).find('*');
				if (elements.size() == 0) {
					console.warn("unable to update navigation: no elements for " + selector);
				}
				elements.filter('.board img').swipe(function(event, data){
		      if (data.direction == 'left') {
		        swipeBoardLeft();
		        return false;
		      }
		      else {
		        swipeBoardRight();
		        return false;
		      }
		    });
		    elements.filter('.simulateSwipeBoardLeft').click(function () {
		      swipeBoardLeft();
		      return false;
		    });
		    elements.filter('.simulateSwipeBoardRight').click(function () {
		      swipeBoardRight();
		      return false;
		    });
			};
			
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