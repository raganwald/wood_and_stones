// (c) 2010 Reg Braithwaite. All rights to the entirety of the program and its parts are reserved with 
// the exception of specific files otherwise licensed. Other licenses apply only to the files where
// they appear.

;(function ($, undefined) {
	
	var game_specific_options = function (event) {
		var game_setup = $.parseJSON($('form.new_game #rules').val());
		var setup_text = $('form.new_game #setup').val();
		$('form.new_game #setup')
			.empty();
		$.each(go.referee.rules.setups[game_setup.setups], function (index, setup) {
			$('<option></option>')
				.text(setup.text)
				.attr('value', setup.text)
				.appendTo($('form.new_game #setup'));
			}
		);
		if ($('form.new_game #setup').has('option:text('+setup_text+')').exists())
			$('form.new_game #setup')
				.val(setup_text);
		else if (setup_text)
			$('form.new_game #setup')
				.val($('form.new_game #setup option:first').text());
		$('form.new_game #dimension')
			.empty();
		$.each(game_setup.sizes, function (index, size) {
			$('<option></option>')
				.text('' + size + 'x' + size)
				.attr('value', size)
				.appendTo($('form.new_game #dimension'));
			}
		);
	};
	
	var setup_new_game = function () {
		$('form.new_game .rules select')
			.each(game_specific_options)
			.blur(game_specific_options)
			.change(game_specific_options);
		$('form.new_game #start')
			.click(function () { $('form.new_game').submit(); return false; });
    	$('form.new_game').submit(function (e) {
			go.sgf.game_info = {
				FF: 4,
				SZ: $('form.new_game #dimension').val(),
				AP: "Wood and Stone",
				PH: $('form.new_game #black').val() || 'Black', // custom: 'player host'
				PG: $('form.new_game #white').val() || 'White', // custom: 'player guest'
				GR: $('form.new_game #rules option:selected').text(),
				GS: $('form.new_game #setup option:selected').text()
			};
			go.sgf.game_info.PB = go.sgf.game_info.PH; // TODO: restore picking black or white
			go.sgf.game_info.PW = go.sgf.game_info.PG;
			go.sgf.current = [go.sgf.game_info];
			var game_setup = $.parseJSON($('form.new_game #rules').val());
			go.sgf.game_info.GM = game_setup.GM;
			var setup_text = $('form.new_game #setup').val();
			var setup;
			$.each(go.referee.rules.setups[game_setup.setups], function (i, each_setup) {
				if (each_setup.text == setup_text)
					setup = each_setup;
			});
			$.extend(go.sgf.game_info, setup.sgf);
			if (setup.setup) {
				go.letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's'].slice(0, go.sgf.game_info.SZ);
				setup.setup();
			}
			go.sgf.doit($('.move.play .board'), go.sgf.game_info);
			jQT.swapPages($('#new'), $('.move.play'));
      		return false;
    	});

   		var sgf_text = go.sgf.persistence();
   		if (sgf_text && sgf_text.indexOf('RE[') < 0) { // cheesy check for end of game
     		go.dialog({
				title: "Reload Gamle",
				message: "You have a saved game. Continue playing it?",
				yes_button: "Continue",
				no_button: "No",
				yes_callback: function () {
		   			go.sgf.text(sgf_text);
		   			jQT.swapPages($('#new'), $('.move.play'));
				}
			});
   		}
	};
	
	var window_size_hack = function() {
		if (window.innerWidth <= window.innerHeight)
			window.resizeTo(768,1024);
		else window.resizeTo(1024,768);
	};
	
	$(function () {
		setup_new_game();
		window_size_hack();
	});
	
})(jQuery);