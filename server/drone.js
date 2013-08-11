var drone = require('ar-drone');
var fs = require('fs');
var client  = drone.createClient();
var imageProcessor = require("./imageprocess.js");

function streamImages() {
	client.getPngStream().on("data", function(data) {
		imageProcessor.detect(data);
		/*fs.writeFile("snapshot.png", data, function(err) {
			if (err) {
				console.log(err);
			} else {
				console.log("Snapshot saved");
			}
		});*/
	});
}

exports.getImage = function() {
 return imageProcessor.result;
}

var liftSpeed = 0.4;
var liftDirection = 0; // 0 -> do nothing, 1 -> down, 2 -> neutral, 3 -> up
function setHover(targetHeight) {
	client.on('navdata', function(navData) {
		if (liftDirection == 0) return;

		if (navData.hasOwnProperty("demo")) {
			var offset = targetHeight - navData.demo.altitudeMeters;
			if (0.2 < offset && liftDirection != 3) {
				console.log("Lifting");
				liftDirection = 3;
				client.up(liftSpeed);
			} else if (offset < -0.2 && liftDirection != 1) {
				console.log("Dropping");
				liftDirection = 1;
				client.down(liftSpeed);
			} else if (liftDirection != 2) {
				console.log("Hovering");
				liftDirection = 2;
				client.stop();
			}
		}
	});
}

exports.init = function() {
	//setHover(0.5);
	client.config("video:video_channel", 3);
	streamImages();
	console.log("Drone initialized");
}

exports.start = function(cb){
	console.log("Attempting takeoff");
	client.takeoff(function() {
		liftDirection = 2;
		console.log("Takeoff successful");
	});
}

exports.followpath = function(cb) {
	console.log("F");
	client.forward(0.2);
	setInterval(function() {
			console.log("S")
			client.stop();
			console.log("R");
			client.counterClockwise(0.4);
			setInterval(function() {
					console.log("S")
					client.stop();
					console.log("F")
					client.forward(0.2);
					setInterval(function() {
							console.log("S")
							client.stop();
						},
					 	1000
						);
				},
				2000
				);
		},
		1000
		);
}

var manualRotationalSpeed = 0.05;
var manualDirectionalSpeed = 0.2;
var manualTimeApplicable = 500;
var executingManual = false;
exports.go = function(direction, cb) {
	switch (direction) {
		case "l":
			client.counterClockwise(manualRotationalSpeed);
			break;
		case "r":
			client.clockwise(manualRotationalSpeed);
			break;
		case "f":
			client.front(manualDirectionalSpeed);
			break;
		case "b":
			client.back(manualDirectionalSpeed);
			break;
		case "s":
			client.stop();
			break;
		default:
			console.log("Unrecognized movement: " + direction);
			break;
	}
}

var vidChannel = 0;
exports.switchCamera = function(cb) {
	vidChannel = (vidChannel == 0 ? 3 : 0);
	client.config("video:video_channel", vidChannel);
}

exports.stop = function(cb){
	liftDirection = 0;
	client.land(function() {
		console.log("Drone landed");
	});
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
