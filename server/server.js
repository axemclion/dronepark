var express = require("express");
var app = express();
var drone = require("./drone.js")

//app.use(express.logger());
app.use("/", express.static(__dirname + "/static"));

app.get("/server/start", function(req, res) {
	drone.start(respond(req, res));
});

app.get("/server/calibrate", function(req, res) {
	drone.followpath(respond(req, res));
});

app.get("/server/followpath", function(req, res) {
	drone.followpath(respond(req, res));
});

app.get("/server/go", function(req, res) {
	drone.go(req.query.d, respond(req, res));
});

app.get("/server/stop", function(req, res) {
	drone.stop(respond(req, res));
});

app.get("/server/image", function(req, res) {
	res.contentType("image/png");
	res.send(drone.getImage());
});

app.get("/server/status", function(req, res) {
	drone.status(respond(req, res));
});

var port = process.env.PORT || 32123;
app.listen(port, function() {
	console.log("Listening on " + port);
	drone.init();
});

function respond(req, res){
	return function(data){
		res.send([req.query.callback, "(", JSON.stringify(data), ");"].join(''));
	}
}
