/*
The MIT License

Copyright (c) 2010 Reginald Braithwaite http://reginald.braythwayt.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/


;(function ($) {
	$.fn.exists = function () {
		return !!(this.length);
	};
	$.fn.exist = $.fn.exists;
	$.fn.ergo = function (fn, optional_converse_fn) {
		if (this.length) {
			fn = typeof(Functional) != 'undefined' ? Functional.lambda(fn) : fn;
			fn(this);
		}
		else if (optional_converse_fn) {
			optional_converse_fn = typeof(Functional) != 'undefined' ? Functional.lambda(optional_converse_fn) : optional_converse_fn;
			optional_converse_fn(this);
		}
		return this;
	};
	$.fn.provided = function (predicate_fn, consequent_fn) {
		predicate_fn = typeof(Functional) != 'undefined' ? Functional.lambda(predicate_fn) : predicate_fn;
		if (predicate_fn(this)) {
			consequent_fn = typeof(Functional) != 'undefined' ? Functional.lambda(consequent_fn) : consequent_fn;
			consequent_fn(this);
		}
		return this;
	};
})(jQuery);