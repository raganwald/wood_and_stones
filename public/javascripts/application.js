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
			var latest_server_info = info;
			var can_process_server_info = true;
			
			var last_displayed_move_number = function () {
				return $('.move:last').data('number');
			};

			var select_move_by_move_number = function (move_number) {
			  return '#m' + move_number;
			};
			
			var select_current_image_by_position  = function (position) {
				return '.move.active .board #' + position;
			}
			
			var position_of_played_stone = function () {
				var target = $('.move.active .board .empty.' + latest_server_info.playing);
				if (target.size() == 1) {
					return target.attr('id');
				}
				else return null;
			};
			
			var stone_has_been_legally_placed = function () {
				return latest_server_info.is_users_turn && ($('.move.active .board .empty.' + latest_server_info.playing).size() == 1);
			};
			
			var process_html_of_latest_moves = function (html, callback) {
				var current_move_number = last_displayed_move_number();
	      var update_moves = $(html).filter('.move').filter(function (i) {
					$(this).data('number', current_move_number + i + 1); // BOO! updates in a select!!
					return $(this).attr('id') == ('m' + (current_move_number + i + 1));
				});
	      if (update_moves.size() > 0) {
	        update_moves.insertAfter('.move:last');
					update_elements_with_navigation_handlers(update_moves);
	        $(select_move_by_move_number(current_move_number) + ' .history .next').removeClass('invisible').show();
	        if (callback) {
	          callback('.move:last');
	        }
					else {
						update_active_div();
						update_latest_server_info();
					}
	      }
	    };
			
			var play_stone  = function (position) {
			  $.ajax({
			    url: info.create_move_f(position),
			    type: 'POST',
			    dataType: 'html',
			    success: function (html) {
						process_html_of_latest_moves(html, function (latest_move_selector) {
							update_active_div();
							update_move_infos();
							update_latest_server_info();
							jQT.goTo($('.move:last'), '');
						});
					},
			    error: function (error_response) {
			      GO.message('error', 'unable to place a stone at ' + position + ' because: ' + error_response.responseText);
			    },
			  });
			};
			
			var pass = function () {
				// TODO: we know if this will end the game, so branch and show the right thing(tm)
			  $.ajax({
			    url: info.create_pass_url,
			    type: 'POST',
			    dataType: 'html',
			    success: function (html) {
						process_html_of_latest_moves(html, function (latest_move_selector) {
							update_active_div();
							update_move_infos();
							update_latest_server_info();
							jQT.goTo($('.move:last'), '');
						});
					},
			    error: function (error_response) {
			      GO.message('error', 'unable to pass because: ' + error_response.responseText);
			    },
			  });
			};
			
			var update_active_div = function () {
			  var move_to_unbind_selector = '.move.active';
			  var places_to_unbind_selector = '.move.active .board .empty.valid';
			
			  return function (active_p) {
				  var move_to_bind_selector = (latest_server_info.is_users_turn ? select_move_by_move_number(latest_server_info.move_number) : NULL_SELECTOR);
			    var places_to_bind_selector = (latest_server_info.is_users_turn ? move_to_bind_selector + ' .board .empty.valid' : NULL_SELECTOR);
			    $(move_to_bind_selector).addClass('active');
			    $(move_to_unbind_selector).not(move_to_bind_selector).removeClass('active');
			    // $(places_to_bind_selector).toggle(click_empty, click_placed).dblclick(place_and_play_stone);
			    // $(places_to_unbind_selector).not(places_to_bind_selector).unbind('click').unbind('dblclick').removeClass(latest_server_info.playing);
			  };
			}();
			var liven_active_positions = function () {
			
				var toggle_placed_stone = function (dbl_click_event_data) {
					var target = $(dbl_click_event_data.currentTarget);
					$('.move.active .board .empty.' + latest_server_info.playing).not(target).removeClass(latest_server_info.playing);
					target.toggleClass(latest_server_info.playing);
				};
			
				var place_and_play_stone = function (dbl_click_event_data) {
				  var target = $(dbl_click_event_data.currentTarget);
					$('.move.active .board .empty.' + latest_server_info.playing).not(target).removeClass(latest_server_info.playing);
					target.addClass(latest_server_info.playing);
					play_stone(target.attr('id'));
				};

				$('.move.active .board .empty.valid').live('click', toggle_placed_stone);
				$('.move.active .board .empty.valid').live('dblclick', place_and_play_stone);
			}();
			
			var get_latest_moves = function (callback) {
			  $.ajax({
			    url: info.get_updates_f(last_displayed_move_number()),
			    type: 'GET',
			    dataType: 'html',
			    success: function (html) {
			      process_html_of_latest_moves(html, callback)
			    },
			    error: function (error_response) {
			      GO.message('error', 'unable to load the game history after ' + last_displayed_move_number() + ' because: ' + error_response.responseText);
			    }
			  });
			};
			
			var process_server_info = function () {
		    if (!can_process_server_info) {
		      return null;
		    }
		    can_process_server_info = false;
		    if (latest_server_info.move_number > last_displayed_move_number()) {
		      var was_current_move_number = last_displayed_move_number();
					console.log('requesting updates for moves from ' + was_current_move_number + ' to ' + latest_server_info.move_number);
		      if (latest_server_info.is_users_turn) {
		        get_latest_moves(function (latest_select_move_by_move_number) { // updates current_move_number
		          update_active_div();
		          update_move_infos();
		          can_process_server_info = true;
		          if ($(select_move_by_move_number(was_current_move_number)).is('.current')) {
								console.log('fading from ' + was_current_move_number + ' to ' + last_displayed_move_number());
		            jQT.goTo($(latest_select_move_by_move_number), 'fade');
		          }
		        });
		      }
		      else {
		        get_latest_moves(function (latest_select_move_by_move_number) { // updates current_move_number
		          update_active_div();
		          update_move_infos();
		          can_process_server_info = true;
		          if ($(select_move_by_move_number(was_current_move_number)).is('.current')) {
								console.log('fading from ' + was_current_move_number + ' to ' + last_displayed_move_number());
		            jQT.goTo($(latest_select_move_by_move_number), 'fade');
		          }
		        });
		      }
		    }
		    else {
		      update_active_div();
		      can_process_server_info = true;
		    }
		  };
		
			var update_move_infos = function () {
				console.log("update_move_infos");
				var selector = select_move_by_move_number(latest_server_info.move_number);
				if (latest_server_info.move_number > 0) {
					if (latest_server_info.game_state != 'ended') {
						$(selector).find('.info .desc').addClass('current').text('current position.');
					}
					else {
						$(selector).find('.info .desc').addClass('current').text('position at the end of the game.')
					}
					$('.move').not(selector).has('.info .desc.current').each(function (index, move_el) {
						console.log('found an outdated move ' + $(move_el).attr('id'));
						$(move_el).find('.info .desc.current').removeClass('current').text('position after move ' + $(move_el).data('number') + '.');
						$(move_el).find('.info .news').text('');
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
					else if (latest_server_info.playing == 'white') {
						news_text = 'Thus, you are waiting for black to play or pass.';
					}
				}
				else if (latest_server_info.move_number == 0) {
					news_text = news_text + 'It is ' + latest_server_info.to_play + "'s turn.";
				}
				$(selector).find('.info .news').text(news_text);
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
									$(el).data('number', i + 1);
								});
				      	update_moves.insertAfter('#m0');
								update_elements_with_navigation_handlers(update_moves);
							}
				      $(select_move_by_move_number(current_move_number) + ' .history .prev').removeClass('invisible').show();
				    },
				    error: function (error_response) {
				      console.error('unable to load the game history before ' + current_move_number + ' because: ' + error_response.responseText);
				    }
				  });
				}
				else {
					$(select_move_by_move_number(current_move_number) + ' .history .prev').removeClass('invisible').show();
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
			
			var update_elements_with_navigation_handlers = function () {
				var goto_move = function (selector, animation) {
					console.log('trying to go to ' + selector);
					if ($(selector).size() > 0) {
						jQT.goTo(selector, animation);
						return true;
					}
					else return false;
				};
				var swipeBoardLeft = function (target) {
					var this_move = $(target).parents('.move');
					console.log("swiping left from " + this_move.attr('id'));
					if (goto_move(this_move.next('.move'), '')) {
						return true;
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
				};
				var swipeBoardRight = function (target) {
					var this_move = $(target).parents('.move');
					console.log("swiping right from " + this_move.attr('id'));
					goto_move(this_move.prev('.move'), '');
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
				liven_active_positions();
			};
			
			return {
				  update_move_infos: update_move_infos,
				  update_active_on_current_board: update_active_div,
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