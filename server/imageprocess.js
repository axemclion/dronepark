var cv = require('opencv');

exports.detect = function(data){
	cv.readImage(data, function(err, im){
		im.convertGrayscale();
		im.canny(5, 300);
		im.houghLinesP();
		im.save('axe1.png');
	})
}