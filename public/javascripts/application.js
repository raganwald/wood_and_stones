var GO = function () {
	return {
		message: function (title, text) {
      $('#message h1').text(title);
      $('.message').text(text);
      jQT.goTo($('#message'), 'flip');
		},
		submit: function(e, success, error) {
		  var $form = (typeof(e)==='string') ? $(e) : $(e.target);
		  $.ajax({
		      url: $form.attr('action'),
		      data: $form.serialize(),
		      type: $form.attr('method') || "POST",
		      success: success,
		      error: error
		  });
		},
		get: function(u, success, error) {
		  $.ajax({
		      url: u,
		      type: "GET",
		      success: success,
		      error: error
		  });
		}
	};
}();