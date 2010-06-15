// (c) 2010 Reg Braithwaite. All rights to the entirety of the program and its parts are reserved with 
// the exception of specific files otherwise licensed. Other licenses apply only to the files where
// they appear.
;(function ($, F, undefined) {
	var to_text = function () {
		var info = ';FF['+go.sgf.game_info.FF+']'+
			'GM['+go.sgf.game_info.GM+']'+
			'SZ['+go.sgf.game_info.SZ+']\n\n';
		for (key in go.sgf.game_info) {
			if (go.sgf.game_info.hasOwnProperty(key) && 'FF' != key && 'GM' != key && 'SZ' != key) {
				info = info + key + F.map('"["+_+"]"', go.sgf.game_info[key].split(',')).join('') + '\n';
			}
		}
		return '(' + info + F.map(function (move) {
			var move_text = '\n;';
			for (key in move) {
				if (move.hasOwnProperty(key)) {
					var property = move[key];
					move_text = move_text + key + ('string' == typeof(property) ? F.map('"["+_+"]"', move[key].split(',')).join('') : '['+property+']');
				}
			}
			return move_text;
		}, go.sgf.current.slice(1, go.sgf.current.length)).join('') + ')';
	};
	
	var from_text = function(text) {
		console.error('Implement me');
		return '';
	};
	
	$(function() {
		go.sgf.text = function(optional_text) {
			if (optional_text) {
				return from_text(optional_text);
			}
			else return to_text();
		};
	});
})(jQuery, Functional);