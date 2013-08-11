var drone = require('ar-drone');
var fs = require('fs');
var client  = drone.createClient();
var process = require('./imageprocess.js');


client.getPngStream().on("data", function(data) {
	fs.writeFile("snapshot.png", data, function(err) {
		if (err) {
			console.log(err);
		} else {
			console.log("Snapshot saved");
			process.detect("snapshot.png");
		}
	})
	
});
