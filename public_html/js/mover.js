"use strict";

var BOXSIZE = 16;
var divCntTotal = 0;
var divsPerSecSum = 0;
var divWidth, divHeight;

$(document).ready(function() {
	divCntTotal += drawSquares(5);
	$("#divsOnScreen").text(divCntTotal);
	var img = document.getElementById("imgTriona");
	drawImgWatermark(getImgData(img), img.width, img.height);

	$(".btnStart").click(function() {
		$(".btnStart").remove();
		benchmark();
	});
});

function getImgData(img) {
	var imgWidth = img.width, imgHeight = img.height;
	var ctx = $("#myCanvas")[0].getContext("2d");
	ctx.drawImage(img, 0, 0);
	var imgDataOrigin = ctx.getImageData(0, 0, imgWidth, imgHeight);
	return imgDataOrigin;
}

function drawImgWatermark(imgDataOrigin, imgWidth, imgHeight) {
	console.log("Img=" + imgWidth + "x" + imgHeight);
	var divs = $("#wrapper div");

	var xOffset = divWidth > imgWidth ? parseInt((divWidth - imgWidth) / 2) : 0;
	var yOffset = divHeight - imgHeight;
	for (var y = 0, imgIdx = 0; y < imgHeight; y++) {
		for (var x = 0; x < imgWidth; x++, imgIdx += 4) {
			var r = imgDataOrigin.data[imgIdx];
			if (r < 60) continue;
			var divIdx = (y + yOffset) * divWidth + x + xOffset;
			var div = divs[divIdx];
			var rgbDiv = readColor(div.style.backgroundColor);
			var r1 = parseInt(x <  imgWidth / 2 ? rgbDiv[0] ^ 255 : rgbDiv[0] * 1.5),
				g1 = parseInt(x >= imgWidth / 2 ? rgbDiv[1] ^ 255 : rgbDiv[1] * 1.5),
				b1 = parseInt(rgbDiv[2] * 1.5);
			divs[divIdx].style.backgroundColor = "rgb(" + r1 + "," + g1 + "," + b1 + ")";
		}
	}
	$("#wrapper").append(divs);
}

function readColor(rgbString) {
	var iComma1 = rgbString.indexOf(",");
	var iComma2 = rgbString.indexOf(",", iComma1 + 1);
	var iPar1 = rgbString.indexOf("(");
	var iPar2 = rgbString.indexOf(")");
	var r = parseInt(rgbString.substring(iPar1 + 1, iComma1));
	var g = parseInt(rgbString.substring(iComma1 + 1, iComma2));
	var b = parseInt(rgbString.substring(iComma2 + 1, iPar2));
	return [r,g,b];
}

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
		var divCnt = drawSquares(bgColorAdd);
		divCntTotal += divCnt;
		var dur = window.performance.now() - t1;
		var divsPerSecond = parseInt(1000.0 / dur * divCnt);
		$("#cnt").text(divsPerSecond);
		divsPerSecSum += divsPerSecond;
		var divsPerSecAvg = parseInt(divsPerSecSum / cnt);
		console.log(cnt + ": divCntTotal=" + divCntTotal + ", t=" + dur + ", DIVs/s = " +
				divsPerSecond + ", Avg DIVs/s=" + divsPerSecAvg);
		if (cnt === 10) {
			showBtnMouseMove();
			$(".plWait").remove();
			$("#divsPerSec").text(parseInt(divsPerSecAvg));
		}
	}, 500);
}

function showBtnMouseMove() {
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
			document.location.href = "https://www.google.com";
		});
	});
}

function drawSquares(bgColorAdd) {
	$("#wrapper").empty();
	var width = $("body").width(), height = $("body").height();
	var divCnt = 0;
	divWidth = parseInt(width / BOXSIZE), divHeight = parseInt(height / BOXSIZE);
	var divs = [];

	for (var y0 = 0; y0 < height; y0+=BOXSIZE) {
		var bgColor = 255;

		for (var x = 0, x0 = 0; x < divWidth; x0+=BOXSIZE, x++) {
			var pos = "left: " + x0 + "px; top: " + y0 + "px; ";
			bgColor += (x0 < width / 2) ? -bgColorAdd : bgColorAdd;
			if (bgColor > 255) bgColor = 255;
			var bg = (x0 < width / 2) ?
				"background-color: rgb(" + parseInt(bgColor) + ", 0,0); " :
				"background-color: rgb(0," + parseInt(bgColor) + ", 0); ";
			divs.push("<div class='box' style='" + pos + bg + "'></div>\n");
			divCnt++;
		}
	}

	$("#wrapper")[0].innerHTML = divs;
	return divCnt;
}