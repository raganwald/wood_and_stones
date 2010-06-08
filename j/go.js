// (c) 2010 Reg Braithwaite. All rights to the entirety of the program and its parts are reserved with 
// the exception of specific files otherwise licensed. Other licenses apply only to the files where
// they appear.

;(function ($, F, undefined) {
	
	var document_ready = function () {
		go.dialog = function(options) {
			options = $.extend(
				{},
				{
					title: 'hey!',
					yes_button: 'Ok',
					no_button: 'Cancel',
					yes_callback: F.I,
					no_callback: F.I
				},
				(options || {})
			);
			if (!options.no_button) {
				alert(options.message);
				options.yes_callback();
			}
			else if (confirm(options.message))
				options.yes_callback();
			else options.no_callback();
		};
		go.message = function (say, optional_button_name) {
			go.dialog({
				message: say,
				no_button: null
			});
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
	};
	
	var set_titles = function () {
			// $('style:last')
			// 	.text('.move.black:has(.board.play) .toolbar span.playing:before{ content: "' + go.sgf.game_info.PB + ' to play"; } ' +
			// 	      '.move.white .toolbar span.playing:before{ content: "' + go.sgf.game_info.PW + ' to play"; }'  );
		$('style#toolbar_titles')
			.text([
				'.move.re_black .toolbar h1:before{ content: "' + go.sgf.game_info.PB + ' wins"; } ',
				'.move.re_white .toolbar h1:before{ content: "' + go.sgf.game_info.PW + ' wins"; } ',
				'.move.re_draw  .toolbar h1:before{ content: "Game Ended"; }',
				  
				'.landscape .move.black:not(.swap):not(re_black):not(re_white):not(re_draw) .head .toolbar h1:before{ content: "' 
					+ (go.sgf.game_info.PB.match(/black/i)  ? 'Black to play' : go.sgf.game_info.PB + ' to play black') + '"; } ',
			    '.landscape .move.white:not(.swap)  .head .toolbar h1:before{ content: "' 
					+ (go.sgf.game_info.PW.match(/white/i)  ? 'White to play' : go.sgf.game_info.PW + ' to play white') + '"; } ',
			    '.landscape .move.black.swap .head .toolbar h1:before{ content: "' 
					+ (go.sgf.game_info.PB.match(/black/i)  ? 'Black to play or swap' : go.sgf.game_info.PB + ' to play black or swap') + '"; } ',
			    '.landscape .move.white.swap .head .toolbar h1:before{ content: "'
					+ (go.sgf.game_info.PW.match(/white/i)  ? 'White to play or swap' : go.sgf.game_info.PW + ' to play white or swap') + '"; } '
			].concat(
				go.sgf.game_info.PB == go.sgf.game_info.PH ? [
					'.profile   .move.black:not(.swap):not(re_black):not(re_white):not(re_draw) .head .toolbar h1:before{ content: "'
					+ (go.sgf.game_info.PB.match(/black/i)  ? 'Black to play' : go.sgf.game_info.PB + ' to play black') + '"; } ',
				    '.profile   .move.white:not(.swap)  .foot .toolbar h1:before{ content: "'
					+ (go.sgf.game_info.PW.match(/white/i)  ? 'White to play' : go.sgf.game_info.PW + ' to play white') + '"; } ',
				    '.profile   .move.black.swap .head .toolbar h1:before{ content: "' 
					+ (go.sgf.game_info.PB.match(/black/i)  ? 'Black to play or swap' : go.sgf.game_info.PB + ' to play black or swap') + '"; } ',
				    '.profile   .move.white.swap .foot .toolbar h1:before{ content: "'
					+ (go.sgf.game_info.PW.match(/white/i)  ? 'White to play or swap' : go.sgf.game_info.PW + ' to play white or swap') + '"; } '
				] : [
					'.profile   .move.black:not(.swap):not(re_black):not(re_white):not(re_draw) .foot .toolbar h1:before{ content: "' 
					+ (go.sgf.game_info.PB.match(/black/i)  ? 'Black to play' : go.sgf.game_info.PB + ' to play black') + '"; } ',
				    '.profile   .move.white:not(.swap)  .head .toolbar h1:before{ content: "' 
					+ (go.sgf.game_info.PW.match(/white/i)  ? 'White to play' : go.sgf.game_info.PW + ' to play white') + '"; } ',
				    '.profile   .move.black.swap .foot .toolbar h1:before{ content: "' 
					+ (go.sgf.game_info.PB.match(/black/i)  ? 'Black to play or swap' : go.sgf.game_info.PB + ' to play black or swap') + '"; } ',
				    '.profile   .move.white.swap .head .toolbar h1:before{ content: "'
					+ (go.sgf.game_info.PW.match(/white/i)  ? 'White to play or swap' : go.sgf.game_info.PW + ' to play white or swap') + '"; } '
				]
			).join(' '));
		// $('style#bubbles')
		// 	.text([
		// 		'.landscape .move.play .board .toolbar h1:before{ } ',
		// 	    '.landscape .move.white:not(.swap)  .head .toolbar h1:before{ content: "' 
		// 			+ (go.sgf.game_info.PW.match(/white/i)  ? 'White to play' : go.sgf.game_info.PW + ' to play white') + '"; } ',
		// 	    '.landscape .move.black.swap .head .toolbar h1:before{ content: "' 
		// 			+ (go.sgf.game_info.PB.match(/black/i)  ? 'Black to play or swap' : go.sgf.game_info.PB + ' to play black or swap') + '"; } ',
		// 	    '.landscape .move.white.swap .head .toolbar h1:before{ content: "'
		// 			+ (go.sgf.game_info.PW.match(/white/i)  ? 'White to play or swap' : go.sgf.game_info.PW + ' to play white or swap') + '"; } '
		// 	].concat(
		// 		go.sgf.game_info.PB == go.sgf.game_info.PH ? [
		// 			'.profile   .move.black:not(.swap):not(re_black):not(re_white):not(re_draw) .head .toolbar h1:before{ content: "'
		// 			+ (go.sgf.game_info.PB.match(/black/i)  ? 'Black to play' : go.sgf.game_info.PB + ' to play black') + '"; } ',
		// 		    '.profile   .move.white:not(.swap)  .foot .toolbar h1:before{ content: "'
		// 			+ (go.sgf.game_info.PW.match(/white/i)  ? 'White to play' : go.sgf.game_info.PW + ' to play white') + '"; } ',
		// 		    '.profile   .move.black.swap .head .toolbar h1:before{ content: "' 
		// 			+ (go.sgf.game_info.PB.match(/black/i)  ? 'Black to play or swap' : go.sgf.game_info.PB + ' to play black or swap') + '"; } ',
		// 		    '.profile   .move.white.swap .foot .toolbar h1:before{ content: "'
		// 			+ (go.sgf.game_info.PW.match(/white/i)  ? 'White to play or swap' : go.sgf.game_info.PW + ' to play white or swap') + '"; } '
		// 		] : [
		// 			'.profile   .move.black:not(.swap):not(re_black):not(re_white):not(re_draw) .foot .toolbar h1:before{ content: "' 
		// 			+ (go.sgf.game_info.PB.match(/black/i)  ? 'Black to play' : go.sgf.game_info.PB + ' to play black') + '"; } ',
		// 		    '.profile   .move.white:not(.swap)  .head .toolbar h1:before{ content: "' 
		// 			+ (go.sgf.game_info.PW.match(/white/i)  ? 'White to play' : go.sgf.game_info.PW + ' to play white') + '"; } ',
		// 		    '.profile   .move.black.swap .foot .toolbar h1:before{ content: "' 
		// 			+ (go.sgf.game_info.PB.match(/black/i)  ? 'Black to play or swap' : go.sgf.game_info.PB + ' to play black or swap') + '"; } ',
		// 		    '.profile   .move.white.swap .head .toolbar h1:before{ content: "'
		// 			+ (go.sgf.game_info.PW.match(/white/i)  ? 'White to play or swap' : go.sgf.game_info.PW + ' to play white or swap') + '"; } '
		// 		]
		// 	).join(' '));
	};
	
	var predoit = function (board, this_move) {
		return board;
	};
	
	var postdoit = function(board, this_move) {
		
		if (board.closest('.move').is(':not(.history)')) {
	
			board
				.K(go.referee.validate);

			if (!sgf.game_info.RE) {
				board
					.closest('.move')
						.removeClass('re_black re_white re_draw');
			}
			else if ('B' == sgf.game_info.RE[0]) {
				board
					.closest('.move')
						.removeClass('black white')
						.addClass('re_black');
			}
			else if ('W' == sgf.game_info.RE[0]) {
				board
					.closest('.move')
						.removeClass('black white')
						.addClass('re_white');
			}
			else {
				board
					.closest('.move')
						.removeClass('black white')
						.addClass('re_draw');
			}
		
		}
		
		return board;
	};
		
	var floor = function(index) {
		while (index >= 0 && (go.sgf.current[index]['MN'] == undefined)) {
			--index;
		}
		return index;
	};
	
	var ceiling = function(index) {
		while (go.sgf.current[index] && (go.sgf.current[index]['MN'] == undefined)) {
			++index;
		}
		return index;
	};
	
	var push = function (this_move) {
		go.sgf.current.push(this_move);
		doit($('.move.play .board'), this_move);
		return this_move;
	}
	
	var pop = function () {
		console.error('implement me!');
	}
	
	var doit = function (board, this_move) {
		
		board = predoit(board, this_move);

		var switch_turns = switch_maker(board);
		
		var to_play = this_move.PL;
		
		board
			.find('.latest')
				.removeClass('latest');
		
		if (this_move.B != undefined || this_move.AB != undefined || this_move.W != undefined || this_move.AW != undefined)
			board
				.find('.changed')
					.removeClass('changed');
		
		var play = this_move.B;
		if (play && play != '') {
			board
				.find('#' + play)
					.addClass('black latest changed');
			switch_turns();
		}
		else if (play == '') {
			switch_turns();
		}
		else {
			play = this_move.W;
			if (play && play != '') {
				board
					.find('#' + play)
						.addClass('white latest changed');
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
					.addClass('black changed' + (this_move != go.sgf.game_info ? ' latest' : ''));
		}
		placements = this_move.AW;
		if (placements) {
			board
				.find($.map(placements.split(','), "'#' + _".lambda()).join(','))
					.addClass('white changed' + (this_move != go.sgf.game_info ? ' latest' : ''));
		}
		if (this_move.K && (this_move.W || this_move.B)) 
			board
				.find($.map(this_move['K'].split(','), '"#" + _'.lambda()).join(','))
					.removeClass('white black')
					.addClass('changed');
					
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
				// this is the last play
				board
					.removeClass('place')
					.addClass('play')
					.closest('.move')
						.addClass(go.sgf.game_info.PI ? 'swap' : '')
						.end()
				switch_turns();
			}
		}
		if (this_move.PL)
			switch_turns(this_move.PL); // wins over all other considerations
			
		return postdoit(board, this_move);
	};
	
	var undoit = function (board, this_move, optional_previous_move) {
		
		board = predoit(board, this_move);
		
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
							.removeClass(was_playing)
							.addClass('changed')
							.end()
						.find(
							$.map(
								(this_move['K'] && this_move['K'].split(',')) || [], 
								'"#" + _'.lambda()).join(',')
						)
							.addClass((was_playing == 'black' ? 'white changed' : 'black changed'));
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
			
		return postdoit(board, this_move);
	};
	
	var sgf = {
		
		game_info: undefined,
		
		current: undefined,
		
		root: undefined,
		
		floor: floor,
		
		ceiling: ceiling,
		
		doit: doit,
		
		undoit: undoit,
		
		push: push,
		
		pop: pop
		
	};
	
	go = {
		letters: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's'],
		playing: playing,
		opponent: opponent,
		sgf: sgf,
		set_titles: set_titles,
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
	
})(jQuery, Functional);