var drone = require('ar-drone');
var fs = require('fs');
var client  = drone.createClient();

function streamImages() {
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

var droneStopped = true;
var liftSpeed = 0.4;
var liftStopped = true;
function setHover(targetHeight) {
	client.on('navdata', function(navData) {
		if (!droneStopped) {
			var offset = targetHeight - navData.demo.altitudeMeters;
			var absOffset = offset < 0 ? offset * -1 : offset;
			console.log("Offset: " + offset + ", " + navData.demo.altitudeMeters);
			if (absOffset > 0.2) {
				liftStopped = false;
				if (offset > 0) {
					client.up(liftSpeed);
					console.log("Lifting");
				} else {
					client.down(liftSpeed);
					console.log("Dropping");
				}
			} else if (!liftStopped) {
				liftStopped = true;
				client.stop();
				console.log("Hovering");
			}
		}
	});
}

exports.init = function() {
	setHover(2.0);
	console.log("Drone initialized");
}

exports.start = function(cb){
	droneStopped = false;
	console.log("Attempting takeoff");
	client.takeoff(function() {
		console.log("Takeoff successful");
		client.back(0.02);
		cb({});
	});
}

var manualRotationalSpeed = 0.1;
var manualDirectionalSpeed = 0.1;
var manualTimeApplicable = 2000;
exports.go = function(direction, cb) {
	switch (direction) {
		case "l":
			client.counterClockwise(manualRotationalSpeed);
			setInterval(
				function() { client.clockwise(manualRotationalSpeed); },
				manualTimeApplicable
				);
			break;
		case "r":
			client.clockwise(manualRotationalSpeed);
			setInterval(
				function() { client.counterClockwise(manualRotationalSpeed); },
				manualTimeApplicable
				);
			break;
		case "f":
			client.front(manualDirectionalSpeed);
			setInterval(
				function() { client.back(manualDirectionalSpeed); },
				manualTimeApplicable
				);
			break;
		case "b":
			client.back(manualDirectionalSpeed);
			setInterval(
				function() { client.front(manualDirectionalSpeed); },
				manualTimeApplicable
				);
			break;
		default:
			console.log("Unrecognized movement: " + direction);
			break;
	}
}

var vidChannel = 0;
exports.switchCamera = function() {
	vidChannel = (vidChannel == 0 ? 3 : 0);
	client.config("video:video_channel", vidChannel);
	cb({});
}

exports.stop = function(cb){
	droneStopped = true;
	console.log("Drone returning");
	// Return to origin
	client.land(function() {
		console.log("Drone landed");
	});
	cb({});
}

var count = 0;
exports.status = function(cb){
	console.log(count);
	count++;
	if (count > 10){
		cb({status: 'complete'});
		count = 0;
	} else {
		cb({status: 'searching', count: count});
	}
}
