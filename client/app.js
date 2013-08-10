var handle, server = 'http://127.0.0.1:32123/';

$('.start').click(function(){
	$.getJSON(server + 'start?callback=?', function(data) {
		$('.stop').toggleClass('hide');
		$('.start').toggleClass('hide');

		handle = window.setInterval(function(){
			$.getJSON(server + 'status?callback=?', function(data){
				if (data && data.status && data.status === 'complete'){
					window.clearInterval(handle);
				}
			});
		}, 1000);
	});
});

$('.stop').click(function(){
	$.getJSON(server + 'stop?callback=?', function(data) {
		window.clearInterval(handle);
	});
});