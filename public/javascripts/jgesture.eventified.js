// The MIT License
// 
// Copyright (c) 2010 Reginald Braithwaite
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

// This Javascript sets up the body to accept gesture events and then sends them
// back to the target as custom events like 'gesture_left' or 'gesture_close'.
//
// See jGesture

(function () {
	
	var class_that_wants_close_gestures = 'wants_close';

	$(function () {
		$('body')
			.gesture(function (gesture_data) {
					var name = gesture_data.getName();
					if (name != null && name != '') {
						var event = jQuery.Event("gesture_" + name);
						event.gesture_data = gesture_data;
						event.unhandled = true;
						$(gesture_data.target).trigger(event);
					}
					return false;
				}, {
					startgesture: "touchstart mousedown",
					stopgesture: "touchend mouseup",
					intragesture: "touchmove mousemove"
				})
			.bind('gesture_close', function (event) {
					if (event.unhandled) {
						event.unhandled = false;
						$(event.target)
							.parents('body > *')
								.find('.' + class_that_wants_close_gestures)
									.trigger(event);
					}
					return false;
				});
	});
	
})();