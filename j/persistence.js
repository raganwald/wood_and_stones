;(function($, undefined) {					
	// refactor this sucka out of go.js
	var key = 'raganwald.github.com.go.sgf';
	var save = function(text) {
		localStorage.removeItem(key);
		localStorage.setItem(key, text);
		return text;
	};
	
	var load = function() {
		alert("implement me");
	};
	
	$(function() {
		go.sgf.persistence = function(optional_text) {
			if (optional_text) {
				return save(optional_text);
			}
			else return load();
		};
	});
})(jQuery);