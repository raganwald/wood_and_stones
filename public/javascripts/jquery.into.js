;(function ($) {
	$.fn.into = function (fn) {
		fn(this);
		return this;
	};
})(jQuery);