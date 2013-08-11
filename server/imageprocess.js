var cv = require('opencv');

exports.detect = function(data) {
	var lowThresh = 0;
	var highThresh = 100;
	var nIters = 2;
	var maxArea = 2500;

	var GREEN = [0, 255, 0]; //B, G, R
	var WHITE = [255, 255, 255]; //B, G, R
	cv.readImage(data, function(err, im) {
		im.convertGrayscale();
		im.canny(lowThresh, highThresh);
		im.dilate(nIters);

		contours = im.findContours();
		console.log(contours.size());

		im.drawAllContours(contours, WHITE);

		exports.result = im.toBuffer();
	})
}

exports.result = "axe";