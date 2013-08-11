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

var targetHeight = 1.0;
var liftSpeed = 0.5;
var liftDirection = 0; // 0 -> do nothing, 1 -> down, 2 -> neutral, 3 -> up
function setHover() {
	client.on('navdata', function(navData) {
		if (liftDirection == 0) return;

		if (navData.hasOwnProperty("demo")) {
			var offset = targetHeight - navData.demo.altitudeMeters;
			if (0.2 < offset) {
				if (liftDirection != 3) {
					console.log("Lifting");
					liftDirection = 3;
					client.up(liftSpeed);
				}
			} else if (offset < -0.2) {
				if (liftDirection != 1) {
					console.log("Dropping");
					liftDirection = 1;
					client.down(liftSpeed);
				}
			} else {
				if (liftDirection != 2) {
					console.log("Hovering");
					liftDirection = 2;
					client.stop();
				}
			}
		}
	});
}

var normalHeight = 1.5;
var objectDetectedHeight = 0.2;
function setObjectDetection(targetSize) {
	setInterval(function() {
			if (imageProcessor.contoursSize() >= 25) {
				targetHeight = objectDetectedHeight;
			} else {
				targetHeight = normalHeight;
			}
		},
		100
		);
}

exports.init = function() {
	setHover();
	client.config("video:video_channel", 3);
	streamImages();
	setObjectDetection();
	console.log("Drone initialized");
}

exports.start = function(cb){
	console.log("Attempting takeoff");
	client.takeoff(function() {
		liftDirection = 2;
		console.log("Takeoff successful");
	});
	cb({});
}

exports.calibrate = function(cb) {
	console.log("Calibrating");
	client.calibrate(0);
	cb({});
}

var pathSpeed = 0.1;
exports.followpath = function(cb) {
	client.front(pathSpeed);
	setTimeout(function() {
			client.stop();
			client.counterClockwise(0.4);
			setTimeout(function() {
					client.stop();
					client.front(pathSpeed);
					setTimeout(function() {
							client.stop();
						},
					 	1500
						);
				},
				2000
				);
		},
		1500
		);
	cb({});
}

var manualRotationalSpeed = 0.4;
var manualDirectionalSpeed = 0.2;
exports.go = function(direction, cb) {
	switch (direction) {
		case "f":
			client.front(manualDirectionalSpeed);
			break;
		case "b":
			client.back(manualDirectionalSpeed);
			break;
		case "l":
			client.left(manualDirectionalSpeed);
			break;
		case "r":
			client.right(manualDirectionalSpeed);
			break;
		case "rl":
			client.counterClockwise(manualRotationalSpeed);
			break;
		case "rr":
			client.clockwise(manualRotationalSpeed);
			break;
		case "s":
			client.stop();
			break;
		default:
			console.log("Unrecognized movement: " + direction);
			break;
	}
	cb({});
}

var vidChannel = 0;
exports.switchCamera = function(cb) {
	vidChannel = (vidChannel == 0 ? 3 : 0);
	client.config("video:video_channel", vidChannel);
	cb({});
}

exports.stop = function(cb){
	liftDirection = 0;
	client.land(function() {
		console.log("Drone landed");
	});
	cb({});
}

exports.status = function(cb){
	cb(droneStateInfo);
}
