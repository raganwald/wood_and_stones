// (c) 2010 Reg Braithwaite. All rights to the entirety of the program and its parts are reserved with 
// the exception of specific files otherwise licensed. Other licenses apply only to the files where
// they appear.


;(function ($) {
	$.fn.into = function (fn) {
		fn(this);
		return this;
	};
})(jQuery);