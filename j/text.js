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
				info = info + key + F.map('"["+_+"]"', ('' + go.sgf.game_info[key]).split(',')).join('') + '\n';
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
	
	var from_text = function(sgf) {
		if (sgf && '(' == sgf[0] && ')' == sgf[sgf.length - 1]) {
			// Jamie Zawinsky has something to say about this:
			go.sgf.current = []
			$.each(
				$.map(
					sgf
						.slice(1, sgf.length - 1)
							.replace(/\n/g,'')
								.split(';'),
					function (move_str) {
						if ('' != move_str) {
							var m;
							var object = {};
							do {
							 	m = move_str.match(/^([A-Z][A-Z]?\[.+\](?=[A-Z]))*([A-Z][A-Z]?\[.+\])$/);
								if (m && m.length > 2) {
									move_str = m[1];
									var line = m[2];
									if (line) {
										var mm = line.match(/^([A-Z][A-Z]?)(\[.+\])$/);
										var key = mm[1];
										var values = mm[2].slice(1,-1).split('][');
										if (values.length > 1) {
											object[key] = values.join(',');
										}
										else object[key] = parseInt(values[0]) || values[0];
									}
								}
							} while (move_str && move_str.length > 3);
							return object;
						}
					}
				),
				// go.sgf.push
				function (i, a_move) {
					if (i == 0)
						go.sgf.game_info = a_move;
					go.sgf.push(a_move);
				}
			);
		}
	};
	
	go.sgf.text = function(optional_text) {
		if (optional_text) {
			return from_text(optional_text);
		}
		else return to_text();
	};
		
})(jQuery, Functional);