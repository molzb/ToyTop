$(document).ready(function() {
	var BOXSIZE = 16;

	drawSquares(BOXSIZE);
	$("#wrapper").mousemove(function(event) {
		var x = event.clientX, y = event.clientY;
		$(".box").each(function() {
			var clX = parseInt(this.style.left), clY = parseInt(this.style.top);
			var deltaX = Math.abs(clX - x), deltaY = Math.abs(clY - y);
			var dist = parseInt(Math.sqrt(deltaX * deltaX + deltaY * deltaY) / BOXSIZE);
			this.innerHTML = dist;
		});
		return false;
	});
});

function drawSquares(boxsize) {
	var width = $("body").width(), height = $("body").height();
	var x0 = width / 2, y0 = 0;

	var divs = "";
	while (y0 < height) {
		var bgColor = 0;
		x0 = width / 2;
		while (x0 < width) {
			var pos = "left: " + x0 + "px; top: " + y0 + "px; ";
			var bg = "background-color: rgb(" + bgColor + ", 0,0); ";
			var dim = "width: " + boxsize + "px; height: " + boxsize + "px; ";
			divs += "<div class='box' style='" + pos + bg + dim + "'></div>\n";
			if (bgColor < 255)
				bgColor += 3;
			x0 += boxsize;
		}
		y0 += boxsize;
	}
	var x0 = width / 2, y0 = 0;
	while (y0 < height) {
		var bgColor = 0;
		x0 = width / 2;
		while (x0 > 0) {
			var pos = "left: " + x0 + "px; top: " + y0 + "px; ";
			var bg = "background-color: rgb(0," + bgColor + ",0); ";
			var dim = "width: " + boxsize + "px; height: " + boxsize + "px; ";
			divs += "<div class='box' style='" + pos + bg + dim + "'></div>\n";
			if (bgColor < 255)
				bgColor += 3;
			x0 -= boxsize;
		}
		y0 += boxsize;
	}

	$("#wrapper").append(divs);
}