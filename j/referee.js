// (c) 2010 Reg Braithwaite. All rights to the entirety of the program and its parts are reserved with 
// the exception of specific files otherwise licensed. Other licenses apply only to the files where
// they appear.

;(function ($, undefined) {
	
	var referee = (function () {
		
		var colour_of = function(intersection) {
			if (intersection.hasClass('black'))
				return 'black';
			else if (intersection.hasClass('white'))
				return 'white';
		};
		
		var is_blank = function(intersection ) {
			return !intersection.hasClass('black') && !intersection.hasClass('white');
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
		
		var analyze = function(board, debug) {
			
			if (board == undefined)
				board = $('.move.play .board');
			
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
			
			debug = (debug == undefined ? false : debug);
			if (typeof(board) == 'string')
				board = $(board);
			board
				.find('.intersection')
					.data('group', null)
					.data('liberties', null)
					.removeClass(function (i, clazz) {
						return [
							'group at_liberty atari valid',
							clazz.match(/group_../),
							clazz.match(/last_liberty_is_../),
							clazz.match(/debug_\w+/)
						].join(' ');
					})
					.end()
					
			// first pass, assemble groups
			$.each(go.letters, function (i, across) {
				$.each(go.letters, function (j, down) {
					var id = across + down;
					var intersection = board.find('#' + id);
					if (intersection.is('.black,.white')) {
						var colour = colour_of(intersection);

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
										if (debug) console.info(intersection.attr('id') + ' belongs to ' + group.attr('id'));
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
												if (debug) console.info('merging group for ' + intersection.attr('id') + ' into group for ' + adj.attr('id'));
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
		                    					if (debug) console.info('merging ' + from.attr('id') + ' into ' + to.attr('id'));

												var from_liberties = from.data('liberties');
												var to_liberties = to.data('liberties')
												$.each(from_liberties, function (i, liberty) {
													if ($.inArray(liberty, to_liberties) == -1)
														to_liberties.push(liberty);
												});
										
												from
													.removeClass('group')
													.data('liberties', null);
										
												if (debug) console.info('now ' + to_liberties.length + ' liberties for ' + to.attr('id'));
											
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
			
			var at_liberty_valid = function (board) {
				// console.log('at_liberty_valid');
				return board
					.find('.intersection.at_liberty:not(.white):not(.black)')
						.addClass('valid debug_at_liberty_valid')
						.end();
			};
			
			
			// this is the rule that permits suicide in Go, so removing this
			// rule prohibits suicide!
			
			var killers_valid = function (board) {
				// console.log('killers_valid');
				var opponent = board.closest('.move').is('.black') ? 'white' : 'black';
				
				return board
					.find('.group.atari.' + opponent)
						.each(function (i, el) {
							el = $(el);
							m = el.attr('class').match(/last_liberty_is_(..)/);
							if (m)
								board
									.find('#' + m[1])
										.addClass('valid debug_killers_valid');
						})
						.end()
			};
			
			var extend_group_valid = function (board) {
				// console.log('extend_group_valid');
				var player = board.closest('.move').is('.white') ? 'white' : 'black';
				var adjacents = go.get_adjacents();
				
				return board
					.find('.intersection:not(.valid):not(.white):not(.black)')
						.each(function (i, el) {
							el = $(el);
							var id = el.attr('id');
							if (board.find(adjacents[id]).is('.' + player + ':not(.atari)'))
								el
									.addClass('valid debug_extend_group_valid');
						})
						.end();
			};
			
			var simple_ko_invalid = function (board) {
				var opponent = board.closest('.move').is('.black') ? 'white' : 'black';
				var last_sgf_node = go.sgf.current[go.sgf.current.length - 1];
				var last_id = last_sgf_node[opponent[0].toUpperCase()];
				
				if (last_id && last_id.length == 2 && board.has('#' + last_id)) {
					var killed = last_sgf_node['K'];
					 if (killed) {
						var a = killed.split(',');
						if (a.length == 1) {
							var captured_id = a[0];
							var captured = $('#' + captured_id);
							if (captured.size() == 1 && captured.is('valid')) {
								var recaptured = board
									.find('.last_liberty_is_' + captured_id);
								if (recaptured.size() == 1 && recaptured.attr('id') == last_id)
									captured
										.removeClass('valid')
										.addClass('debug_simple_ko_invalid');
							}
						}
					}
				}
				return board
			};
			
			var two_passes = function (board) {
				if (go.sgf.current.length > 2) {
					var ultimate_index = go.sgf.floor(go.sgf.current.length - 1);
					if (ultimate_index < 2) return board;
					var penultimate_index = go.sgf.floor(ultimate_index - 1);
					if (penultimate_index < 1) return board;
					var ultimate = go.sgf.current[ultimate_index][board.closest('.move').is('.black') ? 'W' : 'B'];
					var penultimate = go.sgf.current[penultimate_index][board.closest('.move').is('.black') ? 'B' : 'W'];
					if (
						(ultimate == '' && penultimate == '') ||
						ultimate != undefined && penultimate != undefined && !board.has('#' + ultimate) && !board.has('#' + penultimate)
					) {
						go.sgf.game_info['RE'] = '0';
						go.message('The game is over!');
					}
				}
				return board;
			};
			
			var no_whites = function (board) {
				if (!board.has('.white')) {
					go.sgf.game_info['RE'] = 'B+1';
					go.message('Black wins by eliminating all whites!');
				}
				return board;
			}
			
			var any_capture = function (board) {
				if (go.sgf.current.length > 1) {
					var ultimate_index = go.sgf.floor(go.sgf.current.length - 1);
					if (go.sgf.current[ultimate_index]['K']) {
						if (go.sgf.current[ultimate_index]['W']) {
							go.message('White wins');
							go.sgf.game_info['RE'] = 'W+1';
						}
						else if (go.sgf.current[ultimate_index]['B']) {
							go.message('Black wins');
							go.sgf.game_info['RE'] = 'B+1';
						}
						else console.error('confused about who actually won')
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
								.into(function (row) {
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
							.into(analyze)
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
			
			var korean_baduk = function () {
					
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
			
			var ancient_chinese = function () {
					
		        var corner = go.sgf.game_info.SZ <= 11 ? 3 : 4;
		        var left = go.letters[ corner - 1 ];
		        var right = go.letters[ go.sgf.game_info.SZ - corner ];
		        var top = left;
		        var bottom = right;
				
				go.sgf.game_info.AB = [left + top, right + bottom].join(',');
				go.sgf.game_info.AW = [left + bottom, right + top].join(',');
			};
			
			var seventeen_free =function () {
				go.sgf.game_info.HA = 17;
			}
			
			return {
				setups: {
					classic: [
						{
							text: "Black plays first",
							sgf: { PL: "black" },
							setup: star_points(0)
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
					other: [
						{
							text: "Dots",
							sgf: { PL: "black" },
							setup: dots
						},
						{
							text: "Influence",
							sgf: { PL: "black" },
							setup: influences
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
							text: "Korean Baduk",
							sgf: { PL: "white" },
							setup: korean_baduk
						},
						{
							text: "Ancient Chinese",
							sgf: { PL: "black" },
							setup: ancient_chinese
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
							text: "Black plays first",
							sgf: { PL: "black" },
							setup: star_points(0)
						},
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
							text: "Kill-all",
							sgf: { PL: "black" },
							setup: seventeen_free
						}
					]
				},
				validations: {
					at_liberty_valid: at_liberty_valid,
					killers_valid: killers_valid,
					extend_group_valid: extend_group_valid,
					simple_ko_invalid: simple_ko_invalid
				},
				endings: {
					two_passes: two_passes,
					any_capture: any_capture,
					connect_sides: connect_sides
				},
				games: {
					"Classic": '{"GM": 1, "setups": "classic", "sizes": [9,11,13,15,17,19], "endings": ["two_passes"], "validations": [ "at_liberty_valid", "killers_valid", "extend_group_valid", "simple_ko_invalid" ]}',
					"Other Go Setups": '{"GM": 1, "setups": "other", "sizes": [9,11,13,15,17,19], "endings": ["two_passes"], "validations": [ "at_liberty_valid", "killers_valid", "extend_group_valid", "simple_ko_invalid" ]}',
					"Atari Go": '{"GM": 12, "setups": "classic", "sizes": [9,11,13,15,17,19], "endings": ["two_passes", "any_capture"], "validations": [ "at_liberty_valid", "killers_valid", "extend_group_valid", "simple_ko_invalid" ]}',
					"White to Live": '{"GM": 14, "setups": "to_live", "sizes": [9,11,13,17,19], "endings": ["two_passes", "no_whites"], "validations": [ "at_liberty_valid", "killers_valid", "extend_group_valid", "simple_ko_invalid" ]}',
					"Gonnect": '{"GM": 13, "setups": "pie", "sizes": [13], "endings": ["two_passes", "connect_sides"], "validations": [ "at_liberty_valid", "killers_valid", "extend_group_valid", "simple_ko_invalid" ]}',
					"One Eye Go": '{"GM": 11, "setups": "classic", "sizes": [9,11,13,15,17,19], "endings": ["two_passes"], "validations": [ "at_liberty_valid", "extend_group_valid" ]}'
				}
			};
		})();
		
		var history_free_validate = function (board) {
			console.error('should not run this default');
			return board;
		};
			
		var game_over = function(board) {
			if (go.sgf.game_info['RE'] != undefined) {
				board
					.find('.intersection.valid')
						.addClass('debug_game_over')
						.removeClass('valid');
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
			history_free_validate = function (board) {
				$.each(steps, function (i, step) {
					board
						.into(step);
				});
				return board;
			}
		};
		
		// validate all legal moves
		var validate = function (board) {
			return board
				.into(analyze)
				.into(history_free_validate);
		};
		
		return {
			set_rules: set_rules,
			analyze: analyze,
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
	
})(jQuery);	