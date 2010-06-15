// (c) 2010 Reg Braithwaite. All rights to the entirety of the program and its parts are reserved with 
// the exception of specific files otherwise licensed. Other licenses apply only to the files where
// they appear.

;(function ($, undefined) {
	
	var game_specific_options = function	(event) {
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
		if ($('form.new_game #setup').has('option:text('+setup_text+')').size() > 0)
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
			go.sgf.root = [go.sgf.game_info];
			go.sgf.current = go.sgf.root;
			go.letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's'].slice(0, go.sgf.game_info.SZ);
			$('.move.play')
				.removeClass('black white')
				.find('.board')
					.removeClass('size9 size11 size13 size15 size17 size19')
					.addClass('size' + go.sgf.game_info.SZ)
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
					.appendTo($('.move.play .board .intersections'));
			});
			var game_setup = $.parseJSON($('form.new_game #rules').val());
			go.sgf.game_info.GM = game_setup.GM;
			go.referee.set_rules(game_setup);
			var setup_text = $('form.new_game #setup').val();
			var setup;
			$.each(go.referee.rules.setups[game_setup.setups], function (i, each_setup) {
				if (each_setup.text == setup_text)
					setup = each_setup;
			});
			$.extend(go.sgf.game_info, setup.sgf);
			if (setup.setup) setup.setup();
			go.sgf.doit($('.move.play .board'), go.sgf.game_info);
			$('#info')
				.find('.players .black')
					.text(go.sgf.game_info.PB)
					.end()
				.find('.players .white')
					.text(go.sgf.game_info.PW)
					.end()
				.find('h1')
					.text(go.sgf.game_info.GR)
					.end()
				.find('.game .setup')
					.text(go.sgf.game_info.GS)
					.end();
			go.set_titles();
			jQT.swapPages($('#new'), $('.move.play'));
      		return false;
    	});
	};
	
	$(setup_new_game);
	
})(jQuery);