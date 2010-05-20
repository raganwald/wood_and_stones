;(function ($, undefined) {
	var SELECTION_EVENT = ($.support.touch ? 'tap' : 'click');
	
	var intialize_move = function (move) {
		
	};
	
	go.ui = {
		intialize_move: intialize_move
	};
	
	var playing = function () {
		return $('.move:last').is('.black') ? 'black' : (
			$('.move:last').is('.white') ? 'white' : null
		);
	};
	
	var opponent = function () {
		return $('.move:last').is('.white') ? 'black' : (
			$('.move:last').is('.black') ? 'white' : null
		);
	};
			
	var initialize_gesture_support = (function () {

		var clear_current_play = function (event) {
			var target = $(event.target);
			set_played_stone(target.find('.intersection.latest:not(.last)'), false);
			set_killed_stones(null, false);
			return false;
		};
		
		var do_pass = function() {
			var text;
			if (info.game_state == 'passed') {
				text = 'Since ' + opponent() + ' just passed, passing will end the game.';
			}
			else {
				text = 'If ' + opponent() + ' passes, the game will end.';
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
		};
		
		return function() {
			$('body')
				.gesture([
					'top', 'bottom', 'ok', 'circle',
					{ scrub: function(target) {
						return $(target)
							.parents('body > *')
								.find('.scrub');
							}
						},
					{ accept: function(target) {
						return $(target)
							.parents('body > *')
								.find('.accept');
							}
						},
					{ preventDefault: false }
				])
				.bind({
					turn:  function (event, data) {
						$('.board')
							.removeClass('portrait landscape')
							.addClass(data.orientation);
					}
				});
			$('.board')
				.addClass(
					window.orientation !== undefined 
						? (Math.abs(window.orientation) == 90 ? 'landscape' : 'profile')
						: (window.innerWidth < window.innerHeight ? 'profile' : 'landscape')
				)
				.live('gesture_scrub', clear_current_play);
			$('.move:last .board:not(:has(.valid.black,.valid.white))')
				.live('gesture_circle', do_pass);
			$('#info')
				.bind('gesture_top', function(event) { jQT.goBack(); });
		};
	})();
			
	var set_played_stone = function (target, play_p) {
		// restore all other plays
		$('.move:last .board .valid.' + playing()).not(target).removeClass(playing());
		// make the play or remove the play
		if (play_p) {
			target.addClass(playing());
			$('.move:last .last').removeClass('latest');
		}
		else {
			target.removeClass(playing());
			$('.move:last .last').addClass('latest');
		}
	};

	var set_killed_stones = function (target, kill_p) {
		// restore all atari stones
		$('.move:last .board .atari' ).addClass(opponent()).removeClass('empty');
		// maybe kill some stones
		if (kill_p) {
			var killed_selector = '.move:last .board .atari.killed_by_' + target.attr('id');
			$(killed_selector)
				.each(function (i,e) {
					e = $(e);
					$(new Image(e.height(), e.width()))
						.attr('src', /^url\((.*)\)/.exec(e.css('background-image'))[1])
						.css({
							position: 'absolute',
							top: e.position().top,
							left: e.position().left,
							'z-index': (e.css('z-index') + 1)
						})
						.addClass('fade_animation')
						.appendTo(e.parent())
						.show();
				})
				.removeClass(opponent())
				.addClass('empty');
			$('.fade_animation').fadeOut(1000, function () {
				$('.fade_animation').remove();
			});
		}
	};
	
	var liven_playing_positions = function () {
		
		// TODO: This needs a major re-think, since clicking a stone should actually
		// play it unless you scrub, which should un-play it.
		var play_stone = function (event_data) {
			var now_playing = playing();
			var target = $(event_data.currentTarget);
			if (!target.is('.intersection')) target = target.closest('.intersection');
			if (target.is('.black,.white')) console.error(target.attr('id') + ' is already occupied');
			target.addClass(now_playing);
			var killed_stones = $('.move:last .intersection.killed_by_'+target.attr('id'));
			var annotation = {};
			annotation[now_playing[0].toUpperCase()] = target.attr('id');
			if (killed_stones.size() > 0) {
				annotation['C'] = 'killed: ' + $.map(killed_stones, 'x -> $(x).attr("id")'.lambda()).join(',');
				killed_stones.removeClass(opponent());
			}
			var last_move = go.sgf.current[go.sgf.current.length - 1];
			if (last_move['MN'] != undefined) annotation['MN'] = last_move['MN'] + 1;
			go.sgf.current.push(annotation);
			//TODO: Allow moves that don't alternate. but not now
			$('.move:last')
				.addClass(opponent())
				.removeClass(now_playing)
				.into(go.referee.intialize_move);
		};

		$('.move:last .board .valid')
			.live(SELECTION_EVENT, play_stone);
	};
	
	go.on_document_ready(function () {
		initialize_gesture_support();
		liven_playing_positions();

		// TODO: Migrate this to the code that actually performs a move
		// update_playing_div()
		// TODO: Complete rewrite to set the title
		// update_move_infos();
		// TODO: Set the hey when making a move? Might need a special case for the first move?
		// update_hey();
	});
	
})(jQuery);