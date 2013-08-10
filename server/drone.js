var drone = require('ar-drone');
var client  = drone.createClient();

exports.start = function(cb){
	cb({status: true})
}

exports.stop = function(cb){
	cb({status: true})
}

exports.status = function(cb){
	cb({status: 'complete'});
}