var drone = require('ar-drone');
var fs = require('fs');
var client  = drone.createClient();

function startImageStream() {
	client.getPngStream().on("data", function(data) {
		fs.writeFile("snapshot.png", data, function(err) {
			if (err) {
				console.log(err);
			} else {
				console.log("Snapshot saved");
			}
		});
	});
}

var targetHeight = 1;
var liftSpeed = 0.05;
var liftStopped = true;
function startHover(cb) {
	client.takeoff(function() {
		console.log("Drone hovering");
		client.on('navdata', function(navData) {
			var offset = targetHeight - navData.demo.altitudeMeters;
			var absOffset = offset < 0 ? offset * -1 : offset;
			if (absOffset > 0.1) {
				liftStopped = false;
				if (offset > 0) {
					client.down(liftSpeed);
				} else {
					client.up(liftSpeed);
				}
			} else if (!liftStopped) {
				liftStopped = true;
			}
		});
		cb();
	});
}

exports.start = function(cb){
	startHover(function() {
		cb();
	});
}

var vidChannel = 0;
exports.switchCamera = function() {
	vidChannel = (vidChannel == 0 ? 3 : 0);
	client.config("video:video_channel", vidChannel);
}

exports.stop = function(){
	console.log("Drone returning");
	// Return to origin
	client.land(function() {
		console.log("Drone landed");
	});
	return {};
}

exports.status = function(){
	return {};
}
