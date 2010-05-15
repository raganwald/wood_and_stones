;(function ($, undefined) {
	
	var message_dialog_instance;
	var message_dialog = function (title, text) {
    message_dialog_instance
			.text(text)
			.dialog({
					title: title,
					buttons: { "Ok": function() { $(this).dialog("close"); } }
				})
			.dialog('open');
	};
	var progress_dialog_instance;
	var progress_count = 0;
	var progress_dialog = function (cmd) {
		// console.log("Progress " + cmd + " with level " + progress_count);
		if (cmd == 'open') {
			if (progress_count == 0) {
				progress_count = 1;
				progress_dialog_instance.dialog('open');
			}
			else {
				progress_count = progress_count + 1;
			}
		}
		else if (cmd == 'close') {
			if (progress_count == 1) {
				progress_count = 0;
				progress_dialog_instance.dialog('close');
			}
			else if (progress_count > 1) {
				progress_count = progress_count - 1;
			}
		}
	};
	
	var document_ready = function () {
		message_dialog_instance = $('<div></div>')
			.dialog({
				dialogClass: 'scrub accept message',
				autoOpen: false,
				height: 'auto',
				title: 'Hey!',
				open: function (event, ui) { 
					message_dialog_instance
						.parent()
							.detach()
							.appendTo('body > .current'); 
				}
			})
			.bind('gesture_scrub', function (event) {
		        message_dialog_instance.dialog("close");
		        return false;
			})
			.bind('gesture_accept', function (event) {
		        alert('TODO: Implement accepting a dialog');
		        return false;
			});
		progress_dialog_instance = $('.ajax_load')
			.dialog({
				dialogClass: 'progress',
				autoOpen: false,
				draggable: false,
				width: 150, // 100,
				height: 72 // 72
			})
			.parent()
				.detach()
				.appendTo('body > .current');
	};
	
	GO = {
		message: message_dialog,
		progress_dialog: progress_dialog,
		on_document_ready: function (new_document_ready) {
			document_ready = (function (old_document_ready) {
				return function () {
					old_document_ready();
					new_document_ready();
				}
			})(document_ready);
		}
	};
	
     $(document).ready(function () { document_ready(); }); 
	
})(jQuery);