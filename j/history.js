;(function ($, undefined) {
	
	var initialize_history_support = function() {
		$('.board.zoomout')
			.live('gesture_left', forwards_in_time)
			.live('gesture_right', backwards_in_time);
	};
	
	go.on_document_ready(initialize_history_support);
	
})(jQuery);