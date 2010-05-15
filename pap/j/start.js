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
		  	// TODO: Set up the new game RIGHT HERE!!!
      		return false;
    	});
	};
	
	GO.on_document_ready(setup_new_game);
	
})(jQuery);