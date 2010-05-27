// (c) 2010 Reg Braithwaite. All rights to the entirety of the program and its parts are reserved with 
// the exception of specific files otherwise licensed. Other licenses apply only to the files where
// they appear.

;(function ($, undefined) {
	
	var document_ready = function () {
		go.dialog = $('<div></div>')
			.dialog({
				dialogClass: 'scrub accept message',
				autoOpen: false,
				height: 'auto',
				title: 'Hey!',
				open: function (event, ui) { 
					go.dialog
						.parent()
							.detach()
							.appendTo('body > .current'); 
				}
			})
			.bind('gesture_scrub', function (event) {
		        go.dialog.dialog("close");
		        return false;
			})
			.bind('gesture_accept', function (event) {
		        go.message('TODO: Implement accepting a dialog');
		        return false;
			});
		go.message = function (say) {
			go.dialog
				.text(say)
				.dialog({
					title: "Hey!!",
					buttons: { 
						"Ok": function() { $(this).dialog("close"); } 
					}
				})
				.dialog('open');
		};
	};
	
	var playing = function (optional_board) {
		var move = optional_board ? optional_board.closest('.move') : $('.move.play');
		return move.is('.black') ? 'black' : (
			move.is('.white') ? 'white' : null
		);
	};
	
	var opponent = function (optional_board) {
		var move = optional_board ? optional_board.closest('.move') : $('.move.play');
		return move.is('.white') ? 'black' : (
			move.is('.black') ? 'white' : null
		);
	};
	
	var switch_maker = function (board) {
		return function(new_player) {
			if (new_player == undefined) new_player = opponent(board);
			board
				.closest('.move')
					.addClass(new_player)
					.removeClass(new_player == 'white' ? 'black' : 'white');
		};
	}
	
	var sgf = {
		
		game_info: undefined,
		
		current: undefined,
		
		root: undefined,
		
		floor: function(index) {
			while (index >= 0 && (go.sgf.current[index]['MN'] == undefined)) {
				--index;
			}
			return index;
		},
		
		ceiling: function(index) {
			while (go.sgf.current[index] && (go.sgf.current[index]['MN'] == undefined)) {
				++index;
			}
			return index;
		},
		
		doit: function (board, this_move) {
	
			var switch_turns = switch_maker(board);
			
			board
				.find('.latest')
					.removeClass('latest');
					
			var play = this_move.B;
			if (play) {
				board
					.find('#' + play)
						.addClass('black latest');
				switch_turns();
			}
			else if (play == '') {
				switch_turns();
			}
			else {
				play = this_move.W;
				if (play) {
					board
						.find('#' + play)
							.addClass('white latest');
					switch_turns();
				}
				else if (play == '') {
					switch_turns();
				}
			}
			var placements = this_move.AB;
			if (placements) {
				board
					.find($.map(placements.split(','), "'#' + _".lambda()).join(','))
						.addClass('black' + (this_move != go.sgf.game_info ? ' latest' : ''));
			}
			placements = this_move.AW;
			if (placements) {
				board
					.find($.map(placements.split(','), "'#' + _".lambda()).join(','))
						.addClass('white' + (this_move != go.sgf.game_info ? ' latest' : ''));
			}
			if (this_move.K) 
				board
					.find($.map(this_move['K'].split(','), '"#" + _'.lambda()).join(','))
						.removeClass('white black');
						
			var to_play = this_move.PL;
			if (to_play)
				board
					.closest('.move')
						.addClass(to_play);
			
			if (go.sgf.game_info.HA) {
				var placed = 0;
				$.each(go.sgf.current, function (i, that_move) {
					if (that_move.AB)
						placed = placed + that_move.AB.split(',').length;
				});			
				if (placed < go.sgf.game_info.HA) {
					board
						.removeClass('play')
						.addClass('place')
						.end();
				}
				else if (this_move.AB || this_move.AW) {
					board
						.removeClass('place')
						.addClass('play')
						.end();
					switch_turns();
				}
			}
			if (this_move.PL)
				switch_turns(this_move.PL); // wins over all other considerations
			return board
				.into(go.referee.validate);
		},
		
		undoit: function (board, this_move, optional_previous_move) {
			
			// TODO: Handle other undoables such as placements
			// optional previous move is only useful for hilighting the dot to play at this point
			// it could be eliminated if we use a comment to annotate it.
			
			var to_play;
			var was_playing;
	
			var switch_turns = switch_maker(board);
			
			if (this_move['B'] != undefined) {
				to_play = 'white';
				was_playing = 'black';
				switch_turns(was_playing);
			}
			else if (this_move['W'] != undefined) {
				to_play = 'black';
				was_playing = 'white';
				switch_turns(was_playing);
			}
			else return; // not undoable
			var was_playing_index = was_playing[0].toUpperCase();
			if (this_move != undefined) {
				var position = this_move[was_playing_index];
				if (position != undefined) {
					if (position) {
						board
							.find('#' + position)
								.removeClass('latest')
								.removeClass(was_playing);
						var m = this_move['C'] && this_move['C'].match(/killed: (..(?:,..)*)/);
						if (m != undefined) {
							board
								.find($.map(m[1].split(','), '"#" + _'.lambda()).join(','))
									.addClass(was_playing == 'black' ? 'white' : 'black');
						}
					}
					var to_play_index = to_play[0].toUpperCase();
					if (optional_previous_move != undefined) {
						var previous_position = optional_previous_move[to_play_index];
						if (previous_position)
							board
								.find('#' + previous_position)
									.addClass('latest');
					}
				// TODO: Deal with titles
				}
			}
			return board
				.into(go.referee.validate);
		}
		
	};
	
	go = {
		letters: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's'],
		playing: playing,
		opponent: opponent,
		sgf: sgf,
		on_document_ready: function (new_document_ready) {
			document_ready = (function (old_document_ready) {
				return function () {
					old_document_ready();
					new_document_ready();
				}
			})(document_ready);
		}
	};
	
     $(document).ready(function () { document_ready(); }); 
	
})(jQuery);