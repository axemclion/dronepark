var drone = require('ar-drone');
var client  = drone.createClient();

exports.start = function(cb){
	cb({status: true})
}

exports.stop = function(cb){
	cb({status: true})
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