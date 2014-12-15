"use strict";

var BOXSIZE = 16;
var divCntTotal = 0;
var divsPerSecSum = 0;

$(document).ready(function() {
	divCntTotal += drawSquares(BOXSIZE, 3);
	$("#divsOnScreen").text(divCntTotal);

	$(".btnStart").click(function() {
		$(".btnStart").remove();
		benchmark();
	});
});

function mouseMove() {
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
}

function benchmark() {
	$(".plWait").show();
	divCntTotal = 0;
	for (var i = 1; i <= 10; i++) {
		doBenchmark(i);
	}
}

function doBenchmark(cnt) {
	window.setTimeout(function() {
		var t1 = window.performance.now();
		var bgColorAdd = 0.3 + (cnt / 3.0);
		var divCnt = drawSquares(BOXSIZE, bgColorAdd);
		divCntTotal += divCnt;
		var dur = window.performance.now() - t1;
		var divsPerSecond = parseInt(1000.0 / dur * divCnt);
		$("#cnt").text(divsPerSecond);
		divsPerSecSum += divsPerSecond;
		var divsPerSecAvg = parseInt(divsPerSecSum / cnt);
		console.log(cnt + ": divCntTotal=" + divCntTotal + ", t=" + dur + ", DIVs/s = " + divsPerSecond + ", Avg DIVs/s=" + divsPerSecAvg);
		if (cnt === 10) {
			showBtnMouseMove();
			$(".plWait").remove();
			$("#divsPerSec").text(parseInt(divsPerSecAvg));
		}
	}, 500);
}

function showBtnMouseMove() {
	console.log("showBtnMouseMove");
	$(".btnMouseMove").show(500).click(function() {
		$("#textWrapper").remove();
		mouseMove();
		mouseClickToFinish();
		return false;
	});
}

function mouseClickToFinish() {
	$("body").click(function() {
		$("body").fadeOut(2000, function() {
			document.location.href = "https://wwww.google.com";
		});
	});
}

function drawSquares(boxsize, bgColorAdd) {
	$("#wrapper").empty();
	var width = $("body").width(), height = $("body").height();
	var x0 = width / 2, y0 = 0;
	var divCnt = 0;

	var divs = "";
	while (y0 < height) {
		var bgColor = 0;
		x0 = width / 2;
		while (x0 < width) {
			var pos = "left: " + x0 + "px; top: " + y0 + "px; ";
			var bg = "background-color: rgb(" + parseInt(bgColor) + ", 0,0); ";
			divs += "<div class='box' style='" + pos + bg + "'></div>\n";
			if (bgColor < 255)
				bgColor += bgColorAdd;
			x0 += boxsize;
			divCnt++;
		}
		y0 += boxsize;
	}
	var x0 = width / 2, y0 = 0;
	while (y0 < height) {
		var bgColor = 0;
		x0 = width / 2;
		while (x0 > 0) {
			var pos = "left: " + x0 + "px; top: " + y0 + "px; ";
			var bg = "background-color: rgb(0," + parseInt(bgColor) + ",0); ";
			var dim = "width: " + boxsize + "px; height: " + boxsize + "px; ";
			divs += "<div class='box' style='" + pos + bg + dim + "'></div>\n";
			if (bgColor < 255)
				bgColor += bgColorAdd;
			x0 -= boxsize;
			divCnt++;
		}
		y0 += boxsize;
	}

	$("#wrapper").append(divs);
	return divCnt;
}