var handle, latlong;
var server = 'http://' + document.location.hostname + ':32123/server/';

navigator.geolocation.watchPosition(geo_success, geo_error, {
	enableHighAccuracy: true,
	maximumAge: 0,
	timeout: 27000
});

var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var map, destination;

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
					destination = data.destination;
					var request = {
					origin:latlong,
						destination: new google.maps.LatLng(destination.latitude, destination.longitude),
						travelMode: google.maps.DirectionsTravelMode.DRIVING
					};
					directionsService.route(request, function(response, status) {
						if (status == google.maps.DirectionsStatus.OK) {
						  directionsDisplay.setDirections(response);
						}
					});
					$('#reached').removeClass('hide');
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

$('#reached').click(function(){
	var merchant = {
		id : 'signup@r.nparashuram.com',
		costPerHour: 10,
		name : 'Hakon Parking lot'
	};
	$('.paymodal').modal({show: true, backdrop: false});
	$('.paymodal .modal-body').html('<p> Garage name : ' + merchant.name + "</p><p> Cost Per Hour : " + merchant.costPerHour + "</p>");
	$('.paymodal .modal-footer').append($('<script>', {
		'src' : "lib/paypal-button.min.js?merchant=" + merchant.id,
		'data-button': 'buynow',
		'data-env': "sandbox",
		'data-currency': 'USD',
		'data-name' : merchant.name,
		'data-quantity-editable': 2,
		'data-amount' : merchant.costPerHour
	}));
});

function geo_success(pos){
	console.log("Geoposition called");
	coord = pos.coords;
	latlong = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
	var mapOptions = {
		zoom: 17,
		center: latlong,
		mapTypeId: google.maps.MapTypeId.ROAD
	}
	map = new google.maps.Map(document.getElementById("maps"), mapOptions);
	var marker = new google.maps.Marker({
	    position: latlong,
	    title:"Drone Location"
	});
	directionsDisplay = new google.maps.DirectionsRenderer();
	directionsDisplay.setMap(map);
	marker.setMap(map);
}

function geo_error(){

}
