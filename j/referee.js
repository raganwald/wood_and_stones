// (c) 2010 Reg Braithwaite. All rights to the entirety of the program and its parts are reserved with 
// the exception of specific files otherwise licensed. Other licenses apply only to the files where
// they appear.

;(function ($, F, undefined) {
	
	var referee = (function () {
		
		var unique = function(arr, optional_seed) {
			if (!optional_seed) optional_seed = [];
			return F.reduce(function (arr, el) {
				return $.inArray(el, arr) >= 0 ? arr : arr.concat([el]);
			}, optional_seed, arr);
		};
		
		// board
		// 	.T(playing)
		//
		// or
		//
		// playing(board)
		//
		var playing = function(board) {
			return board.closest('.move').is('.white') ? 'white' : 'black';
		};
		
		var opposing = function(board) {
			return board.closest('.move').is('.black') ? 'white' : 'black';
		};
		
		// usage:
		//
		// board
		//   .find(...)
		//      .T(their_adjacent_selector)
		//
		// Nota bene: $.map integrates flattening, F.map does not.
		// F.map has string lambdas built it, $.map does not
		var their_adjacent_selector = function(selection) {
			var adjacents = go.get_adjacents();
			return F.reduce(function (unique_arr, arr_to_concat) {
					return unique(arr_to_concat, unique_arr);
				},
				[],
				F.map(function (_) { 
					return adjacents[$(_).attr("id")].split(',')
				}, selection)
			).join(',');
		};
		
		var colour_of = function(intersection) {
			var m = intersection.attr('class').match(/(black|white)/);
			if (m) return m[1];
		};
		
		var opposite_colour_of = function (colour) {
			return colour == 'black' ? 'white' : (
				colour == 'white' ? 'black' : null
			);
		}
		
		var is_blank = function(intersection ) {
			return !colour_of(intersection);
		};
		
		var by_pattern = function (r) {
			return function (i,clazz) { 
				var m = clazz.match(r); 
				return m ? m[0] : ''; 
			}
		};
		
		var before = function (a, b) {
			// returns whether a is before b
			var a_id = a.attr('id');
			var b_id = b.attr('id');
			var a_across = a_id[0];
			var a_down = a_id[1];
			var b_across = b_id[0];
			var b_down = b_id[1];
			
			return (a_across < b_across || (a_across == b_across && a_down < b_down));
		};
		
		var ids_of = function (selection) {
			return $.map(selection, '$(_).attr("id")'.lambda());
		}
		
		var ids_to_selector = function (ids) { 
			return F.map('"#"+', ids).join(','); 
		};
		
		var incremental_analyzer = function (board, debug) {
			// if (debug == undefined) debug = true;
			var adjacents = go.get_adjacents();
			var to_play = playing(board);
			var last_played = opposite_colour_of(to_play);
			var removed = board
				.find('.changed:not(.black):not(.white)')
					.removeClass(by_pattern(/debug_[^ ]+/))
					.removeClass(by_pattern(/group_[^ ]+/))
					.removeClass(by_pattern(/last_liberty_is_[^ ]+/))
					.removeClass('playable_black playable_white atari group no_liberties');
			if (removed.size() > 0) {
				// console.log('removed: ' + F.map('$(_).attr("id")', removed).join(','));
				var adjacents_to_removeds = board
					.find(their_adjacent_selector(removed));
				var adjacent_stones = adjacents_to_removeds
					.filter('.black,.white');
				// console.log('adjacent_stones: ' + F.map('$(_).attr("id")', adjacent_stones).join(','));
				var adjacent_classes = $.map(adjacent_stones, '$(_).attr("class")'.lambda());
				// console.log('PRE_EXISTINGadjacent_classes: ' + adjacent_classes.join(','));
				var adjacent_class_ids = $.map(adjacent_classes, '_.match(/group_(..)/) && _.match(/group_(..)/)[1]'.lambda());
				// console.log('PRE_EXISTINGadjacent_class_ids: ' + adjacent_class_ids.join(','));
				var adjacent_stone_group_ids = unique(adjacent_class_ids);
				// console.log('PRE_EXISTINGadjacent_class_ids: ' + adjacent_class_ids.join(','));
				
				// shortcut assumption: all removed stones are of the same group
				if (removed.size() == 1 && adjacents_to_removeds.size() > adjacent_stones.size() || removed.size() > 2)
					removed
						.addClass('playable_black playable_white');
				if (removed.size() == 1 && adjacent_stones.filter('.black').size() > 0)
					removed
						.addClass('playable_black');
				if (removed.size() == 1 && adjacent_stones.filter('.white').size() > 0)
					removed
						.addClass('playable_white');
					
				
				// console.info(adjacent_stones.size() + ' adjacent_stones in pre-existing groups ' + adjacent_stone_group_ids.join(','))
				// add liberties to groups
				$.each(adjacent_stone_group_ids, function (i, uncle_id) {
					var uncle = board
						.find('#'+uncle_id);
					var liberties = uncle.data('liberties');
					if (!liberties) console.error(uncle_id+" is supposed to be a group, but it has null liberties");
					var cousins = board
						.find('.group_'+uncle_id);
					var new_liberties = removed
						.filter(their_adjacent_selector(cousins));
					// console.info('potential new liberties for '+uncle_id+': '+their_adjacent_selector(cousins));
					liberties = liberties.concat(ids_of(new_liberties));
					liberties = unique(liberties);
					uncle.data('liberties', liberties);
					board
						.find('.atari.group_'+uncle_id)
							.removeClass(by_pattern(/last_liberty_is_../))
							.removeClass('atari'); //TODO collapse into one call
					if (0 == liberties.length) {
						console.error('unexpectedly, removing stones has killed group '+uncle_id+'!?');
					}
					else if (1 == liberties.length) {
						console.error('unexpectedly, removing stones has placed '+ uncle_id+' into atari with one liberty at '+liberties[0]);
						board
							.find('group_'+uncle_id)
								.addClass('atari last_liberty_is_'+liberties[0]);
						if (!board
							.find(adjacents[liberties[0]])
								.is(':not(.black):not(.white)')) {
							board
								.find('#'+liberties[0])
									.addClass('no_liberties')
									.removeClass('playable_'+colour_of(uncle));
						}
					}
				})
				adjacents_to_removeds
					.filter(':not(.black):not(.white)')
						.addClass('playable_black playable_white')
						.removeClass('no_liberties');
			}
			$.each(
				$.map(['black', 'white'], function (colour) {
					return {
						"colour": colour,
						"stones": board.find('.changed.'+colour).removeClass(colour).removeClass(by_pattern(/debug_[^ ]+/))
					};
				}),
				function (i, colour_and_stones) {
					var added_colour = colour_and_stones.colour;
					var hostile_to_added_colour = opposite_colour_of(added_colour); 
					// if (debug) console.info(colour_and_stones.stones.size() + ' ' + added_colour + ' stones');
					$.each(colour_and_stones.stones, function (i, added) {
						// if (debug && board.find('#aa').data('liberties')) console.info('aa\'s liberties are '+ board.find('#aa').data('liberties').join(','));
						added = $(added);
						var added_id = added.attr('id');
						added
							.addClass(added_colour)
							.removeClass('playable_black playable_white no_liberties');
						// console.log('added a '+added_colour+' stone at '+added_id);
						var adjacent_to_added = board
							.find(their_adjacent_selector(added));
						// if (debug) console.log('adjacent ids: '+ids_of(adjacent_to_added).join(','));
						var added_liberties = adjacent_to_added
							.filter(':not(.black):not(.white)');
						var ids_of_added_liberties = ids_of(added_liberties);
						// if (debug) console.log('ids_of_added_liberties '+ids_of_added_liberties);
						// if (debug && board.find('#aa').data('liberties')) console.info('aa\'s liberties are '+ board.find('#aa').data('liberties').join(','));
						var unfrendly_adjacents = adjacent_to_added
							.filter('.' + hostile_to_added_colour);
						var unfriendly_adjacent_group_ids = unique(
							$.map(
								$.map(unfrendly_adjacents, '$(_).attr("class")'.lambda()),
								function (clazz) {
									var m = clazz.match(/group_(..)/);
									if (m) return m[1];
								}
							)
						);
						// console.info('adjacent '+hostile_to_added_colour+' groups '+unfriendly_adjacent_group_ids.join(','));
						$.each(unfriendly_adjacent_group_ids, function (i, mater_id) {
							var matriarch = board
								.find('#'+mater_id);
							var liberties = matriarch.data('liberties');
							if (!liberties) console.error('unexpected lack of liberties for an unfriendly group at '+mater_id);
							var added_index = $.inArray(added_id, liberties);
							// when undoing, the stone is not a pre-existing liberty
							if (added_index >= 0) {
								liberties.splice(added_index, 1);
								matriarch.data('liberties', liberties);
							}
							if (0 == liberties.length) {
								console.error('this is where we implement killing stones in the referee');
								console.error(board.closest('.move').attr('class'));
							}
							else if (1 == liberties.length) {
								board
									.find('.group_'+mater_id)
										.addClass('atari last_liberty_is_'+liberties[0]);
								if (!board
									.find(adjacents[liberties[0]])
										.is(':not(.black):not(.white)')) {
									board
										.find('#'+liberties[0])
											.removeClass('playable_'+hostile_to_added_colour)
											.addClass('no_liberties');
								}
							}
						});
						var frendly_adjacents = adjacent_to_added
							.filter('.' + added_colour);
					
						friendly_adjacent_ids = unique(
							$.map(
								$.map(frendly_adjacents, '$(_).attr("class")'.lambda()),
								function (clazz) {
									var m = clazz.match(/group_(..)/);
									if (m) return m[1];
								}
							)
						);
						// if (debug && board.find('#aa').data('liberties')) console.info('aa\'s liberties are '+ board.find('#aa').data('liberties').join(','));
						// if (debug) console.log('adjacent '+added_colour+'s '+friendly_adjacent_ids.join(','));
						if  (0 == friendly_adjacent_ids.length) {
							// if (debug) console.log('creating a new group');
							added
								.addClass('group group_'+added_id)
								.data('liberties', ids_of_added_liberties);
							// if (debug) console.log('its liberties '+added.data('liberties'));
							if (0 == ids_of_added_liberties.length) {
								console.info('suicide');
							}
							else if (1 == ids_of_added_liberties.length) {
								added
									.addClass('atari last_liberty_is_' + ids_of_added_liberties[0]);
								if (!board
									.find(adjacents[ids_of_added_liberties[0]])
										.is(':not(.black):not(.white)')) {
									board
										.find('#'+ids_of_added_liberties[0])
											.removeClass('playable_'+added_colour)
											.addClass('no_liberties');
								}
							}
						}
						else {
							// if (debug && board.find('#aa').data('liberties')) console.info('aa\'s liberties are '+ board.find('#aa').data('liberties').join(','));
							// if (debug) console.log('extending an existing group at ');
							var pater_id = friendly_adjacent_ids[0];
							// if (debug) console.log('extending an existing group at '+pater_id);
							var patriarch = board
								.find('#'+pater_id);
							var pater_liberties = patriarch
								.data('liberties');
							if (!pater_liberties) console.error('unexpected lack of liberties for an friendly group at '+pater_id);
							// if (debug) console.info(pater_id+'\'s liberties are '+pater_liberties);
							$.each(friendly_adjacent_ids.slice(1, friendly_adjacent_ids.length), function (i, mergee_id) {
								// if (debug) console.info('merging ' + mergee_id + ' into ' + pater_id);
								var mergee_liberties = board
									.find('#'+mergee_id)
										.data('liberties');
								// if (debug) console.info('adding liberties '+mergee_liberties.join(',') +' to '+pater_liberties.join(','));
								pater_liberties = pater_liberties.concat(mergee_liberties);
								board
									.find('.group_'+mergee_id)
										.addClass('group_'+pater_id)
										.removeClass('group group_'+mergee_id);
							});
							// if (debug) console.info('after merges, '+pater_id+'\'s liberties are now '+pater_liberties);
							pater_liberties = unique(pater_liberties.concat(ids_of_added_liberties));
							// if (debug) console.info('after adding added liberties, '+pater_id+'\'s liberties are uniquely '+pater_liberties);
							var added_index = $.inArray(added_id, pater_liberties);
							if (added_index == -1) console.error('unexpectedly, '+added_id+' is not a liberty of '+pater_id);
							pater_liberties.splice(added_index,1);
							// if (debug) console.info('after splicing out the added stone, '+pater_id+'\'s liberties are uniquely '+pater_liberties);
							patriarch
								.data('liberties', pater_liberties);
							// if (debug) console.info(pater_id+'\'s liberties are then '+patriarch.data('liberties'));
							// if (debug) console.log('adding '+added_id+' to '+pater_id);
							added
								.addClass('group_'+pater_id);
							board
								.find('.atari.group_'+pater_id)
									.removeClass(by_pattern(/last_liberty_is_../))
									.removeClass('atari'); //TODO collapse into one call
							if (0 == pater_liberties.length) {
								// if (debug) console.info('patricide'); // allowed by some rule sets
							}
							else if (1 == pater_liberties.length) {
								// if (debug) console.info('atari');
								board
									.find('.group_'+pater_id)
										.addClass('atari last_liberty_is_'+pater_liberties[0]);
								if (!board
									.find(adjacents[pater_liberties[0]])
										.is(':not(.black):not(.white)')) {
									board
										.find('#'+pater_liberties[0])
											.removeClass('playable_'+added_colour)
											.addClass('no_liberties');
								}
							}
						}
						added_liberties
							.each(function (i, liberty) { 
								liberty = $(liberty);
								if (board
									.find(their_adjacent_selector(liberty))
										.is(':not(.black):not(.white)')
								) {
									liberty
										.addClass('playable_black playable_white')
										.removeClass('no_liberties');
									}
								else {
									liberty
										.addClass('no_liberties')
										.removeClass('playable_black playable_white');
								}
							})
					})
				});
			return board;	
		};
		
		var naive_analyzer = function(board, ids_to_analyze, debug) {
			
			board = board || $('.move.play .board');
			ids_to_analyze = ids_to_analyze || $.map(go.letters,
				function (across) {
					return $.map(go.letters,
						function (down) { return across + down; }
					);
				}
			);
			debug = (debug == undefined ? false : debug);
			
			// if (debug) {
			// 	console.log('debugging on');
			// 	console.log(ids_to_analyze);
			// }
		
			var adjacents = go.get_adjacents();
			
			// Class decorations:
			//
			// group: this is the head stone of a group. Holds its data.
			//
			// group_xx: identifies a stone as belonging to the group where
			// intersection xx has the group class. The head stone also has this class.
			//
			// last_liberty_is_xx: identifies a stone as belomnging to a group with a single
			// liberty at xx.
			//
			// at_liberty: identifies an empty intersection with at least one liberty.
			//
			// broken: should only remove from ids_to_analyze! maye that whole thing should go
			// or at least be moved to a 'partial analyzer'
			//
			if (typeof(board) == 'string') board = $(board);
			board
				.find('.intersection')
					.data('group', null)
					.data('liberties', null)
					.removeClass(function (i, clazz) {
						return [
							'group at_liberty atari playable_white playable_black',
							clazz.match(/group_../),
							clazz.match(/last_liberty_is_../),
							clazz.match(/debug_\w+/)
						].join(' ');
					})
					.end();
			$.each(ids_to_analyze, function (index, id) {
				// expensive, one search per intersection!
				var intersection = board.find('#' + id);
				var m = intersection
					.attr('class')
						.match(/(black|white)/);
				var colour = m ? m[1] : null;
				if (colour) {

					intersection
						.data('group', intersection)
						.addClass('group_' + id)
						.addClass('group')
						.data('liberties', []);
					
					board
						.find(adjacents[id])
							.filter(':not(.black):not(.white)')
								.each(function (i, adj) {
									adj = $(adj)
									var adj_id = adj.attr('id');
									var group = intersection.data('group');
									// if (debug) console.info(intersection.attr('id') + ' belongs to ' + group.attr('id'));
									var liberties = group.data('liberties');
									if (liberties == null) {
										console.error('no liberties for group ' + group.attr('id') + ' of ' + intersection.attr('id'));
									}
									if (-1 == $.inArray(adj_id, liberties))
										liberties.push(adj_id);
								})
								.end()
							.filter('.black,.white')
								.each(function (i, adj) {
									adj = $(adj)
									if (colour_of(adj) == colour && before(adj, intersection)) {
										var adj_bt = adj.data('group');
										var this_bt = intersection.data('group');
								
										if (adj_bt.attr('id') != this_bt.attr('id')) {
											// if (debug) console.info('merging group for ' + intersection.attr('id') + ' into group for ' + adj.attr('id'));
											var from;
											var to;
											if (before(adj_bt, this_bt)) {
												from = this_bt
												to = adj_bt
											}
											else if (before(this_bt, adj_bt)) {
												from = adj_bt
												to = this_bt
											}
											// merge liberties
	                    					// if (debug) console.info('merging ' + from.attr('id') + ' into ' + to.attr('id'));

											var from_liberties = from.data('liberties');
											var to_liberties = to.data('liberties')
											$.each(from_liberties, function (i, liberty) {
												if ($.inArray(liberty, to_liberties) == -1)
													to_liberties.push(liberty);
											});
								
											from
												.removeClass('group')
												.data('liberties', null);
								
											// if (debug) console.info('now ' + to_liberties.length + ' liberties for ' + to.attr('id'));
									
											board
												.find('.group_' + from.attr('id'))
													.removeClass('group_' + from.attr('id'))
													.addClass('group_' + to.attr('id'))
													.data('group', to);
										}
									}
								});
				}
			});
			
			// second pass, update killed and atari
			board
				.find('.group')
					.each(function (i, group) {
						group = $(group);
						var group_id = group.attr('id');
						var members = board
							.find('.group_' + group_id);
						if (!members.is('.safe')) {
							var liberties = group.data('liberties');
							if (liberties.length == 0) {
								members
									.addClass('dead');
							}
							else if (liberties.length == 1) {
								members
									.addClass('atari last_liberty_is_' + liberties[0]);
							}
						}
					});
			
			// third pass, liberties for empty intersections
			board
				.find('.intersection:not(.black):not(.white)')
					.each(function (i, intersection) {
						intersection = $(intersection);
						if (0 != board
							.find(adjacents[intersection.attr('id')])
								.filter('.intersection:not(.black):not(.white)')
									.size())
							intersection.addClass('at_liberty');
					})
					.end();
					
			return board;
		};
		
		var rules = (function () {
			
			// validity rules
			
			var no_passing_allowed = function(board) {
				return board
					.removeClass('pass');
			};
			
			// i think this goes away with incremental analysis
			var at_liberty_playable = function (board, player, opponent) {
				player = player || playing(board);
				opponent = opponent || opposing(board);
				
				return board
					.find('.intersection.at_liberty:not(.white):not(.black)')
						.addClass('playable_'+player+' debug_at_liberty_play_able_'+player)
						.end()
					.find('.intersection.at_liberty:not(.white):not(.black)')
						.addClass('playable_'+opponent+' debug_at_liberty_play_able_'+opponent)
						.end();
			};
			
			// this is the rule that permits suicide in Go, so removing this
			// rule prohibits suicide!
			
			var killers_playable = function (board, player, opponent) {
				player = player || playing(board);
				opponent = opponent || opposing(board);
				
				var opponent = opposing(board);
				
				return board
					.find('.group.atari.' + opponent)
						.each(function (i, el) {
							el = $(el);
							m = el.attr('class').match(/last_liberty_is_(..)/);
							if (m)
								board
									.find('#' + m[1])
										.addClass('playable_'+player+' debug_killers_play_able_'+player);
						})
						.end()
					.find('.group.atari.' + player)
						.each(function (i, el) {
							el = $(el);
							m = el.attr('class').match(/last_liberty_is_(..)/);
							if (m)
								board
									.find('#' + m[1])
										.addClass('playable_'+opponent+' debug_killers_play_able_'+opponent);
						})
						.end();
			};
			
			var extend_playable_group = function (board, player, opponent) {
				player = player || playing(board);
				opponent = opponent || opposing(board);
				
				var adjacents = go.get_adjacents();
				
				return board
					.find('.intersection:not(.playable_'+ player+'):not(.white):not(.black)')
						.each(function (i, el) {
							el = $(el);
							var id = el.attr('id');
							if (board.find(adjacents[id]).is('.' + player + ':not(.atari)'))
								el
									.addClass('playable_'+player+' debug_extend_play_able_grp_'+player);
						})
						.end()
					.find('.intersection:not(.playable_'+ opponent+'):not(.white):not(.black)')
						.each(function (i, el) {
							el = $(el);
							var id = el.attr('id');
							if (board.find(adjacents[id]).is('.' + opponent + ':not(.atari)'))
								el
									.addClass('playable_'+opponent+' debug_extend_play_able_grp_'+opponent);
						})
						.end();
			};
			
			var simple_ko_unplayable = function (board, player, opponent, debug) {
				// if (debug == undefined) debug = false;
				
				player = player || playing(board);
				opponent = opponent || opposing(board);
				
				// if (debug) console.log('player: '+player);
				
				var last_sgf_node = go.sgf.current[go.sgf.current.length - 1];
				var last_id = last_sgf_node[opponent[0].toUpperCase()];
				
				if (last_id && last_id.length == 2 && board.has('#' + last_id)) {
					// if (debug) console.log(last_id + ' is the last id');
					var killed = last_sgf_node['K'];
					 if (killed) {
						var a = killed.split(',');
						if (a.length == 1) {
							var captured_id = a[0];
							var captured = board
								.find('#' + captured_id);
							// if (debug) console.log(captured_id +'x'+captured.size()+ ' was captured: '+captured.attr('class'));
							if (captured.size() == 1 && captured.is('.playable_'+player)) {
								var recaptured = board
									.find('.last_liberty_is_' + captured_id);
								// if (debug) console.log(captured_id + ' captures '+recaptured.size()+ ' stones');
								if (recaptured.size() == 1 && recaptured.attr('id') == last_id) {
									// if (debug) console.log(captured_id + ' is unplayable due to ko');
									captured
										.removeClass('playable_'+player)
										.addClass('debug_simple_ko_unplay_able_'+player);
								}
							}
						}
					}
				}
				return board
			};
			
			// TODO: Figure out how this works with incremental analysis
			// TODO: figure out how this works with parallel analysis
			var unslidable_unplayable = function (board, player, opponent) {
				player = player || playing(board);
				opponent = opponent || opposing(board);
				
				board
					.find('.temp_slidable')
						.removeClass('temp_slidable');
				var home_intersections = board
					.find(player == 'white' ? '.row:first .intersection' : '.row:last .intersection');
				var home_playing_intersections = home_intersections
					.filter('.' + player);
				var home_group_classes = unique(
					F.reduce('x.concat(y)', [], F.map('$(_).attr("class").match(/group_../)', home_playing_intersections))
				);
				var home_group_intersections = board
					.find(F.map('"." + _', home_group_classes).join(','));
					
				var slidables = board
					.find(their_adjacent_selector(home_group_intersections))
						.add(home_intersections)
							.filter(':not(.black):not(.white)');
				do {
					slidables = slidables
						.addClass('temp_slidable')
						.T(function (_) { 
							return board
								.find(their_adjacent_selector(_)) 
									.filter(':not(.black):not(.white):not(.temp_slidable)');
						})
				} while (slidables.size() > 0);
				
				return board
					.find('.playable_'+player+':not(.temp_slidable)')
						.removeClass('.playable_'+player)
						.end()
					.find('.temp_slidable')
						.removeClass('temp_slidable')
						.end();
			};
			
			// endings
			
			var two_passes_p = function(board, player, opponent) {
				player = player || playing(board);
				opponent = opponent || opposing(board);
				
				if (go.sgf.current.length > 2) {
					var ultimate_index = go.sgf.floor(go.sgf.current.length - 1);
					if (ultimate_index < 2) return false;
					var penultimate_index = go.sgf.floor(ultimate_index - 1);
					if (penultimate_index < 1) return false;
					var ultimate = go.sgf.current[ultimate_index][opponent[0].toUpperCase()];
					var penultimate = go.sgf.current[penultimate_index][player[0].toUpperCase()];
					if (ultimate == undefined || penultimate == undefined) return false;
					if (
						(ultimate == '' || !board.has('#' + ultimate)) && 
						(penultimate == '' || !board.has('#' + penultimate))) return true;
				}
				return false;
			};
			
			var two_passes = function (board) {
				if (two_passes_p(board)) {
					go.sgf.game_info['RE'] = '0';
					go.message('The game is over!');
				}
				return board;
			};
			
			var captures_game = function(board) {
				if (two_passes_p(board)) {
					var whites = 0;
					var blacks = 0;
					$.each(go.sgf.current, function (index, properties) {
						if (properties.W && properties.K)
							blacks = blacks + 1 + ((properties.K.length - 2) / 3);
						else if (properties.W && properties.K)
							whites = whites + 1 + ((properties.K.length - 2) / 3);
					});
					if (whites == blacks) {
						go.sgf.game_info['RE'] = '0';
						go.message('The game is over, you tied with '+whites+' captures each');
					}
					else if (whites > blacks) {
						go.sgf.game_info['RE'] = 'W+'+whites;
						go.message('The game is over, '+go.sgf.game_info.PW+' wins with '+whites+' captures to '+blacks);
					}
					else {
						go.sgf.game_info['RE'] = 'B+'+blacks;
						go.message('The game is over, '+go.sgf.game_info.PB+' wins with '+blacks+' captures to '+whites);
					}
				}
				return board;
			};
			
			var capture_n = function (threshold) {
				return function(board) {
					var whites = 0;
					var blacks = 0;
					$.each(go.sgf.current, function (index, properties) {
						if (properties.W && properties.K)
							blacks = blacks + 1 + ((properties.K.length - 2) / 3);
						else if (properties.B && properties.K)
							whites = whites + 1 + ((properties.K.length - 2) / 3);
					});
					if (threshold <= blacks) {
						go.sgf.game_info['RE'] = 'W+'+blacks;
						go.message('The game is over, '+go.sgf.game_info.PW+' is the first to capture '+threshold+' stone'+ (threshold > 1 ? 's' : ''));
					}
					else if (threshold <= whites) {
						go.sgf.game_info['RE'] = 'B+'+whites;
						go.message('The game is over, '+go.sgf.game_info.PB+' is the first to capture '+threshold+' stone'+ (threshold > 1 ? 's' : ''));
					}
					return board;
				};
			};
			
			var no_legal_move_loses = function (board, player, opponent) {
				player = player || playing(board);
				opponent = opponent || opposing(board);
				
				if (!board.has('.intersection.playable_'+player)) {
					var p = player[0].toUpperCase();
					var o = opponent[0].toUpperCase();
					go.sgf.game_info['RE'] = o+'+1';
					go.message('The game is over, '+go.sgf.game_info['P'+o]+' wins because ' + go.sgf.game_info['P'+p]+' has no playable move');
				}
				return board;
			}
			
			var no_whites = function (board) {
				if (!board.has('.white')) {
					go.sgf.game_info['RE'] = 'B+1';
					go.message('Black wins by eliminating all whites!');
				}
				return board;
			}
				
			var maximum_length = function (board, colour, across, down) {
				return Math.max.apply( Math, 
					$.map(
						[[1,0], [0,1], [1,1], [1,-1]],
						function (deltas) {
							var d = function (distance) {
								var new_across = across+(distance*deltas[0]);
								var new_down = down+(distance*deltas[1]);
								return new_across < 3 || new_across > (go.sgf.game_info.SZ - 2) ||
									new_down < 3 || new_down > (go.sgf.game_info.SZ - 2) ||
									board
										.find('.row:nth-child('+new_down+') .intersection:nth-child('+new_across+')')
											.is('.intersection::not(.'+colour+')');
							};
							return F.until(d, '_+1')(1) + Math.abs(F.until(d, '_-1')(-1) * -1) - 1;
						}
					)
				);
			};
			
			// could be a tad iffy... rethink all of these static add-ons
			var suicide_for_seven = function(board) {
				board
					.find('.no_liberties.playable_white,.no_liberties.playable_black')
						.removeClass('playable_black playable_white')
						.end()
					.find('.no_liberties:not(.black):not(.white)')
						.each(function(i, el) {
							var intersection = $(el);
							var id = intersection.attr('id');
							var across = $.inArray(id[0], go.letters) + 1; // nth-child math
							var down = $.inArray(id[1], go.letters) + 1;
							var max = maximum_length(board, playing(board), across, down);
							console.log(id+' would create ' +max+' in a row');
							if (max >= 7)
								intersection
									.addClass('playable_'+playing(board));
						});
				return board;
			};
			
			// diagonals only works on square boards for now
			var seven_in_a_row_wins = function(board) {
				
				if (go.sgf.current.length > 1) {
					var ultimate_index = go.sgf.floor(go.sgf.current.length - 1);
					var player;
					var last_intersection;
					var colour;
					var id = go.sgf.current[ultimate_index]['W'] || go.sgf.current[ultimate_index]['B'];
					if (go.sgf.current[ultimate_index]['W']) {
						player = go.sgf.game_info.PW;
						colour = 'white';
					}
					else if (go.sgf.current[ultimate_index]['B']) {
						player = go.sgf.game_info.PB;
						colour = 'black';
					}
					else return board;
					var stone = board.find('#'+id);
					if (stone.size() == 0) return board;
					var across = $.inArray(id[0], go.letters) + 1; // nth-child math
					var down = $.inArray(id[1], go.letters) + 1;
					var longest = maximum_length(board, colour, across, down);
					if (colour == 'white' && longest >= 7)	{
						go.sgf.game_info['RE'] = 'W+'+longest;
						go.message(player + ' wins by making a line of '+longest+' stones!');
					}
					else if (colour == 'black' && longest == 7)	{
						go.sgf.game_info['RE'] = 'B+7'
						go.message(player + ' wins by making a line of seven stones!');
					}
					else if (colour == 'black' && longest > 7)	{
						go.sgf.game_info['RE'] = 'W+'+longest;
						go.message(player + ' loses because black may not make a line longer than seven stones!');
					}
				}
				return board;
			};
			
			var connect_sides = function(board) {
				left_groups = board
					.find('.intersection:first-child')
						.map(function(i, el) {
							var m = $(el).attr('class').match(/group_../);
							if (m)
								return '.' + m[0];
						})
							.get()
								.join(',');
				top_groups = board
					.find('.row:first-child .intersection')
						.map(function(i, el) {
							var m = $(el).attr('class').match(/group_../);
							if (m)
								return '.' + m[0];
						})
							.get()
								.join(',');
				connectors = board
					.find('.intersection:last-child')
						.filter(left_groups)
					.add(
						board
							.find('.row:last-child .intersection')
								.filter(top_groups)
					);
				if (connectors.is('.black') && connectors.is('.white')) {
					go.message('Weird, it is a tie!?');
					go.sgf.game_info['RE'] = '0';
				}
				else if (connectors.is('.black')) {
					go.message('Black connects and wins');
					go.sgf.game_info['RE'] = 'B+1';
				}
				else if (connectors.is('.white')) {
					go.message('White connects and wins');
					go.sgf.game_info['RE'] = 'W+1';
				}
			};
			
			// SETUPS
			
			var star_points = function (handicap) {
				
				if (handicap > 0)
				
					return function () {
					
				        var corner = go.sgf.game_info.SZ <= 11 ? 3 : 4;
				        var half = Math.floor(go.sgf.game_info.SZ / 2);
				        var left = go.letters[ corner - 1 ];
				        var center = go.letters[ half ];
				        var right = go.letters[ go.sgf.game_info.SZ - corner ];
				        var top = left;
				        var middle = center;
				        var bottom = right;
						go.sgf.game_info['AB'] = [
							(bottom + left), (top + right), (bottom + right), (top + left), 
							(middle + left), (middle + right), (top + center), (bottom + center), 
		 					(middle + center)
						].slice(0, handicap).join(',');
						go.sgf.game_info['HA'] = handicap;
					};
					
				else return function () { };
				
			};
			
			var random_points = function (black_stones, white_stones) {
				
				return function () {
					
					if ($.isFunction(black_stones))
						black_stones = black_stones();
						
					if ($.isFunction(white_stones))
						white_stones = white_stones();
					
					var eligible_letters = go.letters.slice(2, go.sgf.game_info.SZ - 2);
					var deck = [];
					$.each(eligible_letters, function (i, across) {
						$.each(eligible_letters, function (j, down) {
							deck.push(across + down);
						});
					});
				
			        do {
						deck.sort('Math.random() - 0.5'.lambda());
						
						// This setup actually modifies a test board because
						// it must check for ataris and dead groups
						var board = $('<div></div>')
							.addClass('board');
						$.each(go.letters, function (down_index, down_letter) {
							$('<div></div>')
								.addClass('row')
								.K(function (row) {
									$.each(go.letters, function (across_index, across_letter) {
										$('<img/>')
											.addClass('intersection')
											.attr('id', across_letter + down_letter)
											.attr('src', 'i/dot_clear.gif')
											.appendTo(row);
									});
								})
								.appendTo(board);
						});
						for (i = 0; i < black_stones; ++i) {
							board
								.find('#' + deck[i] + '.intersection')
									.addClass('black');
						}
						for (j = black_stones; j < (white_stones+black_stones); ++j) {
							board
								.find('#' + deck[j] + '.intersection')
									.addClass('white');
						}
					} while (
						board
							.T(naive_analyzer)
							.has('.intersection.atari,.intersection.dead')
								.size() > 0
					)
			
					if (black_stones > 0)
						go.sgf.game_info.AB = deck.slice(0, black_stones).join(',');
					if (white_stones > 0)
						go.sgf.game_info.AW = deck.slice(black_stones, black_stones + white_stones).join(',');
				};
				
			};
			
			var corner = function () {
				var placements = [];
				$.each(go.letters, function (i,across) {
					placements.push(across + 'a');
					if (i > 0)
						placements.push(go.letters[go.letters.length - 1] + across);
				});
				go.sgf.game_info.AB = placements.join(',');
			};
			
			var box = function () {
				var placements = [];
				$.each(go.letters.slice(1, go.letters.length - 1), function (i, letter) {
					placements.push(letter + 'a'); // top
					placements.push(go.letters[go.letters.length - 1] + letter); // right
					placements.push(letter + go.letters[go.letters.length - 1]); // bottom
					placements.push('a' + letter); // left
				});
				go.sgf.game_info.AB = placements.join(',');
			};
			
			var influences = function () {
				var blacks = [];
				var whites = [];
				$.each(go.letters.slice(0, go.letters.length - 1), function (i, letter) {
					whites.push(letter + 'a'); // top
					blacks.push(go.letters[go.letters.length - 1] + letter); // right
				});
				$.each(go.letters.slice(1, go.letters.length), function (i, letter) {
					whites.push(letter + go.letters[go.letters.length - 1]); // bottom
					blacks.push('a' + letter); // left
				});
				go.sgf.game_info.AB = blacks.join(',');
				go.sgf.game_info.AW = whites.join(',');
			};
			
			var dots = function () {
				var blacks = [];
				var whites = [];
				for (i = 0;  i < go.sgf.game_info.SZ; i += 2) {
					var white_down = go.letters[i];
					var black_down = go.letters[i + 1];
					for (j = 0;  j < go.sgf.game_info.SZ; j += 2) {
						var black_across = go.letters[j];
						var white_across = go.letters[j + 1];
						whites.push(white_across + white_down);
						blacks.push(black_across + black_down);
					}
				}
				go.sgf.game_info.AB = blacks.join(',');
				go.sgf.game_info.AW = whites.join(',');
			};
			
			var sunjang_baduk = function () {
					
		        var corner = go.sgf.game_info.SZ <= 11 ? 3 : 4;
		        var half = Math.floor(go.sgf.game_info.SZ / 2);
		        var left = go.letters[ corner - 1 ];
		        var center = go.letters[ half ];
		        var right = go.letters[ go.sgf.game_info.SZ - corner ];
		        var top = left;
		        var middle = center;
		        var bottom = right;
		
				var leftish = go.letters[ corner - 1 + (half - (corner - 1))  / 2 ];
				var rightish = go.letters[ half +  (half - (corner - 1))  / 2 ];
				var topish = leftish
				var bottomish = rightish;
		
				var blacks = [left + top, left + middle, center + middle, right + middle, right + bottom];
				var whites = [left + bottom, center + top, center + bottom, right + top];
		
				if (go.sgf.game_info.SZ >= 17) {
					blacks = blacks.concat([leftish + top, rightish + top, leftish + bottom, rightish + bottom])
					whites = whites.concat([left + topish, left + bottomish, right + topish, right + bottomish])
				}
				
				go.sgf.game_info.AB = blacks.join(',');
				go.sgf.game_info.AW = whites.join(',');
			};
			
			var classical_chinese_opening = function () {
					
		        var corner = go.sgf.game_info.SZ <= 11 ? 3 : 4;
		        var left = go.letters[ corner - 1 ];
		        var right = go.letters[ go.sgf.game_info.SZ - corner ];
		        var top = left;
		        var bottom = right;
				
				go.sgf.game_info.AB = [left + top, right + bottom].join(',');
				go.sgf.game_info.AW = [left + bottom, right + top].join(',');
			};
			
			return {
				setups: {
					classic: [
						{
							text: "Black plays first",
							sgf: { PL: "black" }
						},
						{
							text: "Two stone handicap",
							sgf: { PL: "white", HA: 2 },
							setup: star_points(2)
						},
						{
							text: "Three stone handicap",
							sgf: { PL: "white", HA: 3 },
							setup: star_points(3)
						},
						{
							text: "Four stone handicap",
							sgf: { PL: "white", HA: 4 },
							setup: star_points(4)
						},
						{
							text: "Five stone handicap",
							sgf: { PL: "white", HA: 5 },
							setup: star_points(5)
						},
						{
							text: "Six stone handicap",
							sgf: { PL: "white", HA: 6 },
							setup: star_points(6)
						},
						{
							text: "Seven stone handicap",
							sgf: { PL: "white", HA: 7 },
							setup: star_points(7)
						},
						{
							text: "Eight stone handicap",
							sgf: { PL: "white", HA: 8 },
							setup: star_points(8)
						},
						{
							text: "Nine stone handicap",
							sgf: { PL: "white", HA: 9 },
							setup: star_points(9)
						}
					],
					free: [
						{
							text: "Two free stones",
							sgf: { PL: "black", HA: 2 }
						},
						{
							text: "Three free stones",
							sgf: { PL: "black", HA: 3 }
						},
						{
							text: "Four free stones",
							sgf: { PL: "black", HA: 4 }
						},
						{
							text: "Five free stones",
							sgf: { PL: "black", HA: 5 }
						},
						{
							text: "Six free stones",
							sgf: { PL: "black", HA: 6 }
						},
						{
							text: "Seven free stones",
							sgf: { PL: "black", HA: 7 }
						},
						{
							text: "Eight free stones",
							sgf: { PL: "black", HA: 8 }
						},
						{
							text: "Nine free stones",
							sgf: { PL: "black", HA: 9 }
						}
					],
					other: [
						{
							text: "Pie Rule",
							sgf: { PL: "black", PI: true, HA: 1 },
							setup: star_points(0)
						},
						{
							text: "Wild Fuseki",
							sgf: { PL: "black" },
							setup: random_points(3,3)
						},
						{
							text: "Really Wild Fuseki",
							sgf: { PL: "black" },
							setup: random_points(
								function () { return go.sgf.game_info.SZ - 3; },
								function () { return go.sgf.game_info.SZ - 3; }
							)
						},
						{
							text: "Influence",
							sgf: { PL: "black" },
							setup: influences
						},
						{
							text: "Dots",
							sgf: { PL: "black" },
							setup: dots
						},
						{
							text: "Sunjang Baduk",
							sgf: { PL: "white" },
							setup: sunjang_baduk
						},
						{
							text: "Classical Chinese Opening",
							sgf: { PL: "black" },
							setup: classical_chinese_opening
						}
					],
					atari: [
						{
							text: "Learn about ladders",
							sgf: {
								PL: "black" ,
								AB: "df,ef,fe",
								AW: "ee"
							}
						},
						{
							text: "Learn about nets",
							sgf: {
								PL: "black" ,
								AB: "ec,fc,gd,ge",
								AW: "cd,fd,cg,fg"
							}
						},
						{
							text: "Beat the teacher",
							sgf: {
								PL: "black" ,
								AB: "dd,fd,ef",
								AW: "ee"
							}
						},
						{
							text: "Cross-cutting",
							sgf: {
								PL: "black" ,
								AB: "dd,ee",
								AW: "ed,de"
							}
						}
					],
					capture_five: [
						{
							text: "Cross-cutting",
							sgf: {
								PL: "black" ,
								AB: "dd,ee",
								AW: "ed,de"
							}
						}
					],
					none: [
						{
							text: "Black plays first",
							sgf: { PL: "black" },
							setup: star_points(0)
						}
					],
					pie: [
						{
							text: "Pie Rule",
							sgf: { PL: "black", PI: true, HA: 1 },
							setup: star_points(0)
						}
					],
					to_live: [
						{
							text: "Corner Go",
							sgf: { PL: "white" },
							setup: corner
						},
						{
							text: "Shape Game",
							sgf: { PL: "white" },
							setup: box
						},
						{
							text: "Twenty-one free stones",
							sgf: { PL: "black", HA: 21 }
						},
						{
							text: "Nineteen free stones",
							sgf: { PL: "black", HA: 19 }
						},
						{
							text: "Seventeen free stones",
							sgf: { PL: "black", HA: 17 }
						},
						{
							text: "Fifteen free stones",
							sgf: { PL: "black", HA: 15 }
						},
						{
							text: "Thirteen free stones",
							sgf: { PL: "black", HA: 13 }
						},
						{
							text: "Eleven free stones",
							sgf: { PL: "black", HA: 11 }
						},
						{
							text: "Nine free stones",
							sgf: { PL: "black", HA: 9 }
						}
					]
				},
				analyzers: {
					naive_analyzer: naive_analyzer,
					incremental_analyzer: incremental_analyzer
				},
				validations: {
					// validations for vacant intersections
					at_liberty_playable: at_liberty_playable,
					killers_playable: killers_playable,
					extend_playable_group: extend_playable_group,
					simple_ko_unplayable: simple_ko_unplayable,
					suicide_for_seven: suicide_for_seven,
					unslidable_unplayable: unslidable_unplayable,
					// other validations
					no_passing_allowed: no_passing_allowed
				},
				endings: {
					two_passes: two_passes,
					any_capture: capture_n(1),
					connect_sides: connect_sides,
					no_legal_move_loses: no_legal_move_loses,
					captures_game: captures_game,
					capture_five: capture_n(5),
					seven_in_a_row_wins: seven_in_a_row_wins
				},
				games: {
					"Classic": '{"GM": 1, "setups": "classic", "analyzer": "incremental_analyzer", "sizes": [9,11,13,15,17,19], "endings": ["two_passes"], "validations": [ "at_liberty_playable", "killers_playable", "extend_playable_group", "simple_ko_unplayable" ]}',
					"Free Placement": '{"GM": 1, "setups": "free", "analyzer": "incremental_analyzer", "sizes": [9,11,13,15,17,19], "endings": ["two_passes"], "validations": [ "at_liberty_playable", "killers_playable", "extend_playable_group", "simple_ko_unplayable" ]}',
					"More Setups": '{"GM": 1, "setups": "other", "analyzer": "incremental_analyzer", "sizes": [9,11,13,15,17,19], "endings": ["two_passes"], "validations": [ "at_liberty_playable", "killers_playable", "extend_playable_group", "simple_ko_unplayable" ]}',
					"White to Live": '{"GM": 14, "setups": "to_live", "analyzer": "incremental_analyzer", "sizes": [9,11,13,17,19], "endings": ["two_passes", "no_whites"], "validations": [ "at_liberty_playable", "killers_playable", "extend_playable_group", "simple_ko_unplayable" ]}',
					"Atari Go": '{"GM": 12, "setups": "atari", "analyzer": "incremental_analyzer", "sizes": [9], "endings": ["two_passes", "any_capture"], "validations": [ "at_liberty_playable", "killers_playable", "extend_playable_group", "simple_ko_unplayable" ]}',
					"Capture Five": '{"GM": 12, "setups": "capture_five", "analyzer": "incremental_analyzer", "sizes": [9, 11, 13], "endings": ["two_passes", "capture_five"], "validations": [ "at_liberty_playable", "killers_playable", "extend_playable_group", "simple_ko_unplayable" ]}',
					"Irensei": '{"GM": 15, "setups": "free", "analyzer": "incremental_analyzer", "sizes": [19], "endings": ["seven_in_a_row_wins", "no_legal_move_loses"], "validations": [ "no_passing_allowed", "at_liberty_playable", "killers_playable", "extend_playable_group", "suicide_for_seven", "simple_ko_unplayable" ]}',
					"Gonnect": '{"GM": 13, "setups": "pie", "analyzer": "incremental_analyzer", "sizes": [9,11,13], "endings": ["connect_sides", "no_legal_move_loses"], "validations": [ "no_passing_allowed", "at_liberty_playable", "killers_playable", "extend_playable_group", "simple_ko_unplayable" ]}',
					"One Eye Go": '{"GM": 11, "setups": "classic", "analyzer": "incremental_analyzer", "sizes": [9,11,13,15,17,19], "endings": ["two_passes"], "validations": [ "at_liberty_playable", "extend_playable_group" ]}' //,
					// "Sliding Go": '{"GM": 15, "setups": "free", "sizes": [9,11,13,15,17,19], "endings": ["two_passes"], "validations": [ "at_liberty_playable", "killers_playable", "extend_playable_group", "simple_ko_unplayable", "unslidable_unplayable" ]}',
				}
			};
		})();
		
		var history_free_validate = function (board) {
			console.error('should not run this default');
			return board;
		};
		
		var analyzer = naive_analyzer; // default
			
		var game_over = function(board) {
			if (go.sgf.game_info['RE'] != undefined) {
				board
					.find('.intersection.playable_black,.intersection.playable_white')
						.addClass('debug_game_over')
						.removeClass('playable_black playable_white');
			}
		};
		
		// sets the rules to be used in this game
		var set_rules = function (hash_of_strings) {
			// console.log(hash_of_strings);
			var validations = $.map(
				hash_of_strings.validations,
				function (name, i) {
					return rules.validations[name]
			});
			var endings = $.map(
				hash_of_strings.endings,
				function (name, i) {
					return rules.endings[name]
			});
			var steps = $.merge(endings, validations);
			steps.push(game_over);
			if (hash_of_strings.analyzer) analyzer = rules.analyzers[hash_of_strings.analyzer];
			history_free_validate = function (board) {
				var player = playing(board);
				var opponent = opposing(board);
				F.map(
					function (validation_step) {
						validation_step(board, player, opponent);
					},
					steps
				);
				return board;
			}
		};
		
		// validate all legal moves
		var validate = function (board) {
			return board
				.T(analyzer)
				.T(history_free_validate);
		};
		
		return {
			set_rules: set_rules,
			analyzer: analyzer,
			validate: validate,
			rules: rules
		};
	
	})();
	
	go.on_document_ready(function () { 
		go.referee = referee; 
		$.each(referee.rules.games, function (game, serialized_rules) {
			$('<option></option>')
				.text(game)
				.attr('value', serialized_rules)
				.appendTo($('form.new_game #rules'));
		});
	});
	
})(jQuery,Functional);	