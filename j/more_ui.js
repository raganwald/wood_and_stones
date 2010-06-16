// (c) 2010 Reg Braithwaite. All rights to the entirety of the program and its parts are reserved with 
// the exception of specific files otherwise licensed. Other licenses apply only to the files where
// they appear.

;(function ($, F, undefined) {
	$(function() {
		$('.play .behindthefold')
			.fold({side: 'right', directory: './css/fold', maxHeight: document.width});
	});
})(jQuery, Functional);