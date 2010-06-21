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
				'.move.play.re_black .toolbar h1:before{ content: "' + go.sgf.game_info.PB + ' wins"; } ',
				'.move.play.re_white .toolbar h1:before{ content: "' + go.sgf.game_info.PW + ' wins"; } ',
				'.move.play.re_draw  .toolbar h1:before{ content: "Game Ended"; }',
				  
				'.landscape .move.play.black:not(.swap):not(re_black):not(re_white):not(re_draw) .head .toolbar h1:before{ content: "' 
					+ (go.sgf.game_info.PB.match(/black/i)  ? 'Black to play' : go.sgf.game_info.PB + ' to play black') + '"; } ',
			    '.landscape .move.play.white:not(.swap)  .head .toolbar h1:before{ content: "' 
					+ (go.sgf.game_info.PW.match(/white/i)  ? 'White to play' : go.sgf.game_info.PW + ' to play white') + '"; } ',
			    '.landscape .move.play.black.swap .head .toolbar h1:before{ content: "' 
					+ (go.sgf.game_info.PB.match(/black/i)  ? 'Black to play or swap' : go.sgf.game_info.PB + ' to play black or swap') + '"; } ',
			    '.landscape .move.play.white.swap .head .toolbar h1:before{ content: "'
					+ (go.sgf.game_info.PW.match(/white/i)  ? 'White to play or swap' : go.sgf.game_info.PW + ' to play white or swap') + '"; } '
			].concat(
				go.sgf.game_info.PB == go.sgf.game_info.PH ? [
					'.profile   .move.play.black:not(.swap):not(re_black):not(re_white):not(re_draw) .head .toolbar h1:before{ content: "'
					+ (go.sgf.game_info.PB.match(/black/i)  ? 'Black to play' : go.sgf.game_info.PB + ' to play black') + '"; } ',
				    '.profile   .move.play.white:not(.swap)  .foot .toolbar h1:before{ content: "'
					+ (go.sgf.game_info.PW.match(/white/i)  ? 'White to play' : go.sgf.game_info.PW + ' to play white') + '"; } ',
				    '.profile   .move.play.black.swap .head .toolbar h1:before{ content: "' 
					+ (go.sgf.game_info.PB.match(/black/i)  ? 'Black to play or swap' : go.sgf.game_info.PB + ' to play black or swap') + '"; } ',
				    '.profile   .move.play.white.swap .foot .toolbar h1:before{ content: "'
					+ (go.sgf.game_info.PW.match(/white/i)  ? 'White to play or swap' : go.sgf.game_info.PW + ' to play white or swap') + '"; } '
				] : [
					'.profile   .move.play.black:not(.swap):not(re_black):not(re_white):not(re_draw) .foot .toolbar h1:before{ content: "' 
					+ (go.sgf.game_info.PB.match(/black/i)  ? 'Black to play' : go.sgf.game_info.PB + ' to play black') + '"; } ',
				    '.profile   .move.play.white:not(.swap)  .head .toolbar h1:before{ content: "' 
					+ (go.sgf.game_info.PW.match(/white/i)  ? 'White to play' : go.sgf.game_info.PW + ' to play white') + '"; } ',
				    '.profile   .move.play.black.swap .foot .toolbar h1:before{ content: "' 
					+ (go.sgf.game_info.PB.match(/black/i)  ? 'Black to play or swap' : go.sgf.game_info.PB + ' to play black or swap') + '"; } ',
				    '.profile   .move.play.white.swap .head .toolbar h1:before{ content: "'
					+ (go.sgf.game_info.PW.match(/white/i)  ? 'White to play or swap' : go.sgf.game_info.PW + ' to play white or swap') + '"; } '
				]
			).join(' '));
	};
	
	var predoit = function (board, this_move) {
		return board
			.find('.intersection.changed')
				.removeClass('changed')
				.end();
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
		
			if (go.sgf.game_info.HA) {
				var placed = 0;
				for (var i = 0; i < go.sgf.current.length && placed < go.sgf.game_info.HA; ++i) {
					var that_move = go.sgf.current[i];
					if (that_move.AB)
						placed = placed + that_move.AB.split(',').length;
				}
				if (placed < go.sgf.game_info.HA) {
					board
						.removeClass('play')
						.addClass('place')
						.closest('.move')
							.removeClass(go.sgf.game_info.PI ? 'swap' : '')
						.end();
					switch_maker(board)('black');
					set_titles();
				}
				else if (this_move.AB || this_move.AW) {
					// this is the last play
					board
						.removeClass('place')
						.addClass('play')
						.closest('.move')
							.addClass(go.sgf.game_info.PI ? 'swap' : '')
							.end();
					switch_maker(board)();
					set_titles();
				}
		
				if (this_move.PL)
					switch_maker(board)(this_move.PL); // wins over all other considerations
			}
				
			if (board.closest('.move').is('.play')) {
				$('body #info .sgf')
					.text(go.sgf.persistence(go.sgf.text()));
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
	
	var push = function (this_move, optional_board) {
		optional_board = optional_board || $('.move.play .board');
		go.sgf.current.push(this_move);
		doit($(optional_board), this_move);
		return this_move;
	}
	
	var pop = function (optional_board, optional_from, optional_to) {
		optional_board = optional_board || $('.move.play .board');
		optional_board = typeof(optional_board) == 'string' ? $(optional_board) : optional_board;
		optional_from = optional_from || go.sgf.current.length - 1;
		optional_to = optional_to || go.sgf.floor(go.sgf.current.length - 2);
		
		var from = go.sgf.current[optional_from];
		var to = go.sgf.current[optional_to];
		
		go.sgf.current.pop();
		
		go.sgf.undoit(optional_board, from, to);
	}
	
	var blank_stone = $('<img/>')
		.attr('src', 'i/dot_clear.gif');
	
	var doit = function (board, this_move) {
		
		var update_captured_display = function (colour, stones) {
			var z = stones.size();
			if (z > 0) {
				var c = board.find('.'+colour+'.captured:visible');
				if (c.size() > 0) {
					var n = parseInt(c.text());
					c.text('' + (n ? n + z : z));
				}
				else board.find('.'+colour+'.captured').text(z);
			}
		};
		
		board = predoit(board, this_move);
		
		if (this_move.SZ) {
		
			go.letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's'].slice(0, this_move.SZ);
			board
				.closest('.move')
					.removeClass('black white')
					.end()
				.removeClass('size9 size11 size13 size15 size17 size19')
				.addClass('size' + this_move.SZ)
				.find('.intersections')
					.empty();
			$.each(go.letters, function (down_index, down_letter) {
				$('<div></div>')
					.addClass('row')
					.K(function (row) {
						$.each(go.letters, function (across_index, across_letter) {
							$('<img/>')
								.addClass('intersection playable_black playable_white')
								.attr('id', across_letter + down_letter)
								.attr('src', 'i/dot_clear.gif')
								.appendTo(row);
						});
					})
					.appendTo(board.find('.intersections'));
			});
		}
		
		if (this_move.GM) {
			go.referee.set_rules(this_move.GM);
		}
		
		if (this_move.PB)
			$('#info')
				.find('.players .black')
					.text(this_move.PB);
		if (this_move.PW)
			$('#info')
				.find('.players .white')
					.text(this_move.PW);
		if (this_move.GR)
			$('#info')
				.find('h1')
					.text(this_move.GR);
		if (this_move.GS)
			$('#info')
				.find('.game .setup')
					.text(this_move.GS);

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
			console.log(placements);
			board
				.find($.map(placements.split(','), "'#' + _".lambda()).join(','))
					.addClass('black changed' + (this_move != go.sgf.game_info ? ' latest' : ''));
		}
		placements = this_move.AW;
		if (placements) {
			console.log(placements);
			board
				.find($.map(placements.split(','), "'#' + _".lambda()).join(','))
					.addClass('white changed' + (this_move != go.sgf.game_info ? ' latest' : ''));
		}
		if (this_move.K && (this_move.W || this_move.B)) // TODO: figure out undo and stones!
			board
				.find($.map(this_move['K'].split(','), '"#" + _'.lambda()).join(','))
					.filter('.white')
						.removeClass('white')
						.addClass('changed was_white')
						.K(update_captured_display.curry('white'))
						.end()
					.filter('.black')
						.removeClass('black')
						.addClass('changed was_black')
						.K(update_captured_display.curry('black'))
						.end();
					
		if (to_play)
			board
				.closest('.move')
					.addClass(to_play);
		
		if (this_move.PB && this_move.PW || this_move.PH && this_move.PG) { // swap accepted or rejected
			var new_names = {
				PB: this_move.PB || go.sgf.game_info.PB,
				PW: this_move.PW || go.sgf.game_info.PW,
				PH: this_move.PH || go.sgf.game_info.PH,
				PG: this_move.PG || go.sgf.game_info.PG
			}
			$.extend(go.sgf.game_info, new_names);
			if (new_names.PH != new_names.PB && new_names.PG != new_names.PW) {
				board.find('.guest.captured')
					.removeClass('black')
					.addClass('white');
				board.find('.host.captured')
					.removeClass('white')
					.addClass('black');
			}
			if (go.sgf.game_info.PI)
				board.closest('.move')
					.removeClass('swap');
		}
		
		if (this_move.PB || this_move.PW || this_move.PH || this_move.PG)
			go.set_titles();
			
		return postdoit(board, this_move);
	};
	
	var mover = function (move) {
		if (move.B || move.AB)
			return 'black';
		else if (move.W || move.AW)
			return 'white';
		else if (this_move.PB && this_move.PW || this_move.PH && this_move.PG)
			return 'white';
	};
	
	var next_mover = function (move) {
		if (move.B || move.AB)
			return 'white';
		else if (move.W || move.AW)
			return 'black';
		else if (move.PB && move.PW || move.PH && move.PG)
			return 'white';
	};
	
	var undoit = function (board, this_move, optional_previous_move) {
		
		board = predoit(board, this_move);
		
		// TODO: Handle other undoables such as placements
		// optional previous move is only useful for hilighting the dot to play at this point
		// it could be eliminated if we use a comment to annotate it.
		
		var to_play = next_mover(this_move);
		var was_playing = mover(this_move);
		var positions;

		switch_maker(board)(was_playing);
		
		if (this_move.PB && this_move.PW || this_move.PH && this_move.PG) { 
			var new_names = {
				PB: this_move.PB || go.sgf.game_info.PB,
				PW: this_move.PW || go.sgf.game_info.PW,
				PH: this_move.PH || go.sgf.game_info.PH,
				PG: this_move.PG || go.sgf.game_info.PG
			}
			if (new_names.PH != new_names.PB && new_names.PG != new_names.PW) {
				var old_names;
				if (new_names.PB.match(/black/i) || new_names.PW.match(/white/i)) {
					old_names = {
						PH: new_names.PB,
						PG: new_names.PW
					}
				}
				else {
					old_names = {
						PB: new_names.PH,
						PW: new_names.PG
					}
				}
				$.extend(go.sgf.game_info, old_names);
				board.find('.guest.captured')
					.removeClass('white')
					.addClass('black');
				board.find('.host.captured')
					.removeClass('black')
					.addClass('white');
				go.set_titles();
			}
			if (go.sgf.game_info.PI)
				board.closest('.move')
					.addClass('swap');
		}
		
		if (was_playing != undefined) {
			// replace killed
			board
				.find(
					$.map(
						(this_move['K'] && this_move['K'].split(',')) || [], 
						'"#" + _'.lambda()).join(',')
				)
					.K(function (removed) {
						var z = removed.size();
						if (z > 0) {
							var restore_colour = (was_playing == 'black' ? 'white' : 'black');
							removed.addClass(restore_colour + ' changed');
							var c = board.find('.'+restore_colour+'.captured:visible');
							if (c.size() > 0) {
								var n = parseInt(c.text());
								c.text(n == z ? '' : '' + (n - z));
							}
							else console.error(restore_colour+' should have stones!');
						}
					})
					.end()
				.find(this_move.B || this_move.AB ? F.map('"#" + _', (this_move.B || this_move.AB || '').split(',')).join(',') : '')
					.removeClass('latest')
					.removeClass('black')
					.addClass('changed was_black')
					.end()
				.find(this_move.W || this_move.AW ? F.map('"#" + _', (this_move.W || this_move.AW || '').split(',')).join(',') : '')
					.removeClass('latest')
					.removeClass('white')
					.addClass('changed was_white')
					.end();
		}
		
		if (optional_previous_move != undefined) {
			board
				.find(optional_previous_move.B || optional_previous_move.AB ? F.map('"#" + _', (optional_previous_move.B || optional_previous_move.AB || '').split(',')).join(',') : '')
					.filter(':last')
						.addClass('latest')
						.end()
				.find(optional_previous_move.W || optional_previous_move.AW ? F.map('"#" + _', (optional_previous_move.W || optional_previous_move.AW || '').split(',')).join(',') : '')
					.filter(':last')
						.addClass('latest')
						.end();
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
		playing: playing,
		opponent: opponent,
		sgf: sgf,
		set_titles: set_titles
	};
	
    $(function () { document_ready(); }); 
	
})(jQuery, Functional);