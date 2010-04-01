// Copyright 2010 Reginald Braithwaite
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// This Javascript sets up the body to accept gesture events and then sends them
// back to the target as custom events like 'gesture_left' or 'gesture_close'.
//
// See jGesture

(function () {

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
			.bind('gesture_' + 'close', function (event) {
					if (event.unhandled) {
						event.unhandled = false;
						$(event.target)
							.parents('body > *')
								.find('.wants_' + 'close')
									.trigger(event);
					}
					return false;
				})
			.bind('gesture_' + 'rotateclockwise', function (event) {
					if (event.unhandled) {
						event.unhandled = false;
						$(event.target)
							.parents('body > *')
								.find('.wants_' + 'rotateclockwise')
									.trigger(event);
					}
					return false;
				})
			.bind('gesture_' + 'rotatecounterclockwise', function (event) {
					if (event.unhandled) {
						event.unhandled = false;
						$(event.target)
							.parents('body > *')
								.find('.wants_' + 'rotatecounterclockwise')
									.trigger(event);
					}
					return false;
				});
	});
	
})();