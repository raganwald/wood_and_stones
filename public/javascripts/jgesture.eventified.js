$(function () {
	$('body').gesture(function (gesture_data) {
			var name = gesture_data.getName();
			if (name != null && name != '') {
				var event = jQuery.Event("gesture_" + name);
				event.gesture_data = gesture_data;
				$(gesture_data.target).trigger(event);
			}
			return false;
		}, {
			startgesture: "touchstart mousedown",
			stopgesture: "touchend mouseup",
			intragesture: "touchmove mousemove"
		}
	);
});