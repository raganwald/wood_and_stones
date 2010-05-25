// (c) 2010 Reg Braithwaite. All rights to the entirety of the program and its parts are reserved with 
// the exception of specific files otherwise licensed. Other licenses apply only to the files where
// they appear.

;(function ($, undefined) {
	
	var assign_gravatar = function (event) {
	    $(this)
			.closest('.email')
				.find('img')
					.replaceWith($.gravatar($(this).val(), {
				        // integer size: between 1 and 512, default 80 (in pixels)
				        size: 40,
				        // maximum rating (in order of raunchiness, least to most): g (default), pg, r, x
				        rating: 'pg',
				        // url to define a default image (can also be one of: identicon, monsterid, wavatar)
				        image: 'monsterid'
				    }));
	};
	
	var game_specific_options = function	(event) {
		var rule_setup = $.parseJSON($('form.new_game #rules').val());
		var setup_text = $('form.new_game #setup').val();
		$('form.new_game #setup')
			.empty();
		$.each(go.referee.rules.setups[rule_setup.setups], function (index, setup) {
			$('<option></option>')
				.text(setup.text)
				.attr('value', setup.text)
				.appendTo($('form.new_game #setup'));
			}
		);
		console.log(setup_text);
		if ($('form.new_game #setup').has('option:text('+setup_text+')').size() > 0)
			$('form.new_game #setup')
				.val(setup_text);
		else if (setup_text)
			$('form.new_game #setup')
				.val($('form.new_game #setup option:first').text());
		$('form.new_game #dimension')
			.empty();
		$.each(rule_setup.sizes, function (index, size) {
			$('<option></option>')
				.text('' + size + 'x' + size)
				.attr('value', size)
				.appendTo($('form.new_game #dimension'));
			}
		);
	};
	
	var setup_new_game = function () {
		$('form.new_game .email input')
			.each(assign_gravatar)
			.blur(assign_gravatar);
		$('form.new_game .rules select')
			.each(game_specific_options)
			.blur(game_specific_options)
			.change(game_specific_options);
    	$('form.new_game').submit(function (e) {
			var form = $(e.currentTarget);
		  	go.dimension = $('form.new_game #dimension').val();
			go.letters = go.letters.slice(0, go.dimension);
			if (!$('form.new_game #black').val()) $('form.new_game #black').val('Black');
			if (!$('form.new_game #white').val()) $('form.new_game #white').val('White');
			$('.move')
				.removeClass('black white')
				.find('.board')
					.removeClass('size9 size11 size13 size15 size17 size19')
					.addClass('size' + go.dimension)
					.find('.row')
						.remove()
						.end()
					.end();
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
					.appendTo($('.move .board .dragger'));
			});
			var rule_setup = $.parseJSON($('form.new_game #rules').val());
			go.referee.set_rules(rule_setup);
			var setup_text = $('form.new_game #setup').val();
			var setup;
			$.each(go.referee.rules.setups[rule_setup.setups], function (i, each_setup) {
				if (each_setup.text == setup_text)
					setup = each_setup;
			});
			go.sgf.game_info = {
				FF: 4,
				GM: rule_setup.GM,
				SZ: go.dimension,
				AP: "World of Go Alpha 2",
				// TODO: DT and TM?
				PB: $('form.new_game #black').val(),
				PW: $('form.new_game #white').val(),
				PL: setup.to_play
			};
			go.sgf.root = [go.sgf.game_info];
			go.sgf.current = go.sgf.root;
			$('style:last')
				.text('.move.black .toolbar span.playing:before{ content: "' + go.sgf.game_info.PB + ' to play"; } ' +
				      '.move.white .toolbar span.playing:before{ content: "' + go.sgf.game_info.PW + ' to play"; }'  );
			setup.setup($('.move.play .board'));
			if (setup.HA)
				go.sgf.game_info.HA = setup.HA;
			$('.move')
				.addClass(setup.to_play)
				.into(go.referee.validate);
			jQT.swapPages($('#new'), $('.move.play'));
      		return false;
    	});
	};
	
	go.on_document_ready(setup_new_game);
	
})(jQuery);