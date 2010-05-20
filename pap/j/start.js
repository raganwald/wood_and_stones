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
	
	var setup_new_game = function () {
		$('.email input')
			.each(assign_gravatar)
			.blur(assign_gravatar);
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
			var setup = $.parseJSON($('form.new_game #handicap').val());
			go.sgf = {
				root: [{
					FF: 4,
					GM: rule_setup.GM,
					SZ: go.dimension,
					AP: "World of Go Alpha 2",
					// TODO: DT and TM?
					PB: $('form.new_game #black').val(),
					PW: $('form.new_game #white').val(),
					PL: setup.to_play,
					MN: 0
				}]
			};
			go.sgf.current = go.sgf.root
			var handicap = setup.handicap;
			if (handicap > 0) {
		        var corner = go.dimension <= 11 ? 3 : 4;
		        var half = Math.floor(go.dimension / 2) + 1;
		        var left = ' .intersection:nth-child(' + corner + ')';
		        var center = ' .intersection:nth-child(' + half + ')';
		        var right = ' .intersection:nth-last-child(' + corner + ')';
		        var top = '.row:nth-child(' + corner + ')';
		        var middle = '.row:nth-child(' + half + ')';
		        var bottom = '.row:nth-last-child(' + corner + ')';
				$(
					[
						(bottom + left), (top + right), (bottom + right), (top + left), 
						(middle + left), (middle + right), (top + center), (bottom + center), 
	 					(middle + center)
					].slice(0, handicap).join(',')
				)
					.addClass('black')
					.into(function (placements) {
						go.sgf.root[0]['AB'] = $.map(placements, 'x -> $(x).attr("id")'.lambda()).join(',');
					});
				go.sgf.root[0]['HA'] = handicap;
			}
			$('.move')
				.addClass(setup.to_play)
				.into(go.referee.intialize_move);
			jQT.swapPages($('#new'), $('.move:last'));
      		return false;
    	});
	};
	
	go.on_document_ready(setup_new_game);
	
})(jQuery);