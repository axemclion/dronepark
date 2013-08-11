var drone = require('ar-drone');
var fs = require('fs');
var client  = drone.createClient();
var process = require('./imageprocess.js');

client.config("video:video_channel", 3);
client.getPngStream().on("data", function(data) {
	process.detect(data);
});
var express = require("express");
var app = express();
app.get("/", function(req, res) {
	res.contentType("image/png");
	res.send(process.result);
});

var port =  32123;
app.listen(port, function() {
	console.log("Listening on " + port);
});