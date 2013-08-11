var express = require("express");
var app = express();

var started = false;
//app.use(express.logger());
app.use("/", express.static(__dirname + "/static"));

app.get("/server/start", function(req, res) {
	started = true;
	respond(req, res)({});
});

app.get("/server/calibrate", function(req, res) {
	respond(req, res)({});

});

app.get("/server/followpath", function(req, res) {
	respond(req, res)({});

});

app.get("/server/go", function(req, res) {
	respond(req, res)({});

});


app.get("/server/stop", function(req, res) {
	started = false;
	respond(req, res)({});

});

app.get("/server/image", function(req, res) {
	//res.contentType("image/png");
	//res.send(drone.getImage());
});

var count = 0;
app.get("/server/status", function(req, res) {
	console.log(count);
	if (count++ > 100 || started == false) {
		respond(req, res)({
			status: 'complete'
		});
		count = 0;
	} else {
		respond(req, res)({
			status: 'false'
		});

	}
});

app.get("/server/sms", function(req, res) {
	var request = require('request');
	request.post('https://api.twilio.com/2010-04-01/Accounts/AC52b3594329bbee1cc842ab1837dfe5b4/SMS/Messages.json', {
		auth: {
			user: "AC52b3594329bbee1cc842ab1837dfe5b4",
			pass: "ba83a29410c11c3d2380a36d38587fea"
		},
		form: {
			From: '+14089122757',
			To: "+14157351293",
			Body: "Parking Spot found at 200 2nd Ave S, Seattle"
		}
	}, function(error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log(body)
		}
	});
});

var port = process.env.PORT || 32123;
app.listen(port, function() {
	console.log("Listening on " + port);
});

function respond(req, res) {
	return function(data) {
		res.send([req.query.callback, "(", JSON.stringify(data), ");"].join(''));
	}
}