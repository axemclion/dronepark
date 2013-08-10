var handle;
var server = 'http://' + document.location.hostname + ':32123/server/';

navigator.geolocation.watchPosition(geo_success, geo_error, {enableHighAccuracy: true,maximumAge: 30000,timeout: 27000});

$('.start').click(function(){
	$.getJSON(server + 'start?callback=?', function(data) {
		$('.start').toggleClass('hide');
		$('.status').toggleClass('hide');
		handle = window.setInterval(function(){
			$.getJSON(server + 'status?callback=?&time=', function(data){
				console.log(data);
				if (data && data.status && data.status === 'complete'){
					window.clearInterval(handle);
					$('.parking-searching').addClass('hide');
					$('.parking-found').removeClass('hide');
				}
			});
		}, 1000);
	});
});

$('#recallDrone').on('click',function(){
	$.getJSON(server + 'stop?callback=?', function(data) {
		window.clearInterval(handle);
		$('#recallDrone').hide();
		$('#recalling').removeClass('hide');
	});
});

function geo_success(pos){
	var latlong = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
	var mapOptions = {
		zoom: 17,
		center: latlong,
		mapTypeId: google.maps.MapTypeId.ROAD
	}
	var map = new google.maps.Map(document.getElementById("maps"), mapOptions);
	var marker = new google.maps.Marker({
	    position: latlong,
	    title:"Drone Location"
	});

	marker.setMap(map);
}

function geo_error(){

}