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
	
	var loadit = function() {
		$('body #info .sgf')
			.loadit({
			    key: 'raganwald.github.com.go.sgf',
			    def: 'nothing saved!',
			    errorfunc: function(){
			        alert('Not cool. Get a new browser');
			    }
			})
			.K(function(el) {
				// not generic, specific to what we are saving
				var sgf = $(el).text();

			});
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
			
			//TODO: get this into sgf
			go.referee.set_rules(game_setup);
			
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
	};
	
	$(setup_new_game);
	
})(jQuery);