;(function ($, undefined) {
	
	var assign_gravatar = function (event) {
	    $(this)
			.parents('.email')
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
	
	var update_emails = function () {
		if ($('form.new_game .you_play :checkbox').attr('checked')) {
			$('form.new_game #black').val($('form.new_game #player').val())
			$('form.new_game #white').val($('form.new_game #opponent').val())
		}
		else {
			$('form.new_game #black').val($('form.new_game #player').val())
			$('form.new_game #white').val($('form.new_game #opponent').val())
		}
	};
	
	var setup_new_game = function () {
		$('.email input')
			.each(assign_gravatar)
			.blur(assign_gravatar);
    	$('form.new_game').submit(function (e) {
			update_emails();
			var form = $(e.currentTarget);
		  	go.dimension = $('form.new_game #dimension').val();
			go.letters = go.letters.slice(0, go.dimension);
			$('.move#m0 .board')
				.addClass('size' + go.dimension)
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
					.appendTo($('.move#m0 .board .dragger'));
			});
			var setup = $.parseJSON($('form.new_game #handicap').val());
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
					.addClass('black');
			}
			// console.log($('form.new_game #rules').val());
			go.referee.set_rules($.parseJSON($('form.new_game #rules').val()));
			$('#m0')
				.addClass(setup.to_play + '_to_play')
				.into(go.referee.intialize_move)
				// .into(go.ui.intialize_move)
				// .into(go.navigation.initialize_move)
				;
			jQT.swapPages($('#new'), $('#m0'));
      		return false;
    	});
	};
	
	go.on_document_ready(setup_new_game);
	
})(jQuery);