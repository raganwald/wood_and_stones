;(function () {
	$(function () {
		document.getElementsByTagName('body')[0].onorientationchange = function () {
			var orientation = window.innerWidth < window.innerHeight ? 'profile' : 'landscape';
            $('body')
				.removeClass('profile landscape')
				.addClass(orientation)
				.trigger('turn', {orientation: orientation});
		};
	});
})();