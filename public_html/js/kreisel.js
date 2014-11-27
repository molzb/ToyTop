/* 
    Created on : 10.11.2014, 09:02:32
    Author     : Bernhard Molz
*/
"use strict";
var TILESIZE_X = 64, TILESIZE_Y = 64;
var dragX = 0, dragY = 0, nowT = 0;
var dragDeltaX = 0, dragDeltaY = 0, deltaT = 0;
var deltaX = 0, deltaY = 0;
var pid = 0, timeId = 0;

var cntFinishs = 5;
var cntRemainFinishs = 5;
var cntStrokes = 0;
var cntTime = 90.0;
var score = 0;
var hiscore = 0;

var hiscores = [{name: "bm1", score: 5000},{name: "bm2", score: 4000},{name: "bm3", score: 3000},
	{name: "bm4", score: 2000},{name: "bm5", score: 1000}];
var CNT_HISCORES = 5;

var playfield = [
	"ggggggggggggggg",
	"ggg.........ggg",
	"ggg.........ggg",
	"gggXgg...gggggg",
	"gggXgg...gggggg",
	"gggXgg...gggggg",
	"gggXgg...gggggg",
	"gggggg...gggggg",
	"gogXgggggggggg " ];

$(document).ready(function() {
	$("canvas").mousedown(function(e) {
		dragX = e.pageX;
		dragY = e.pageY;
		nowT = window.performance.now();

		if (timeId === 0) {
			updateTime();
		}
	});
	$("canvas").mouseup(function(e) {
		dragDeltaX = e.pageX - dragX;
		dragDeltaY = e.pageY - dragY;
		deltaT = parseInt(window.performance.now() - nowT);
		deltaX = dragDeltaX / deltaT;
		deltaY = dragDeltaY / deltaT;
		$("#strokes").text(++cntStrokes);
		showDebug(deltaX, deltaY, deltaT);

		rotate(deltaX, deltaY);
	});

	$(".playagain .yes").click(function() {
		$(".playagain").hide();
		play();
	});
	$(".playagain .no").click(function() {
		$(".playagain").hide();
		window.location.href = "https://www.google.com";
	});
});

function showPlayfield() {
	var left = 0, top = 0;
	for (var row = 0; row < playfield.length; row++) {
		var p_row = playfield[row];
		left = 0;
		for (var col = 0; col < p_row.length; col++) {
			var letter = p_row[col];
			var tile = "";
			switch (letter) {
				case "g": tile = "images/green.png"; break;
				case ".": tile = "images/blue.png"; break;
				case "X": tile = "images/hole.png"; break;
				case "o": tile = "images/red.png"; break;
				case " ": tile = "images/yellow.png"; break;
			}
			var style = "style='position: absolute; left: " + left + "px; top:" + top + "px'";
			$("body").append("<img src='" + tile + "' alt='' " + style + "/>");
			left += TILESIZE_X;
		}
		top += TILESIZE_Y;
	}
}

function play() {
	cntFinishs = 5, cntRemainFinishs = 5, cntStrokes = 0, cntTime = 90.0, score = 0;
	blinkArrows();
	hideSplash();
	$("#myCanvas").css("left", "50px").css("top", "100px"); 
}

function updateTime() {
	var timeInterval = 100;
	var time = $("#time");
	timeId = window.setInterval(function() {
		cntTime -= 0.1;
		var strTime = Math.round(cntTime * 10) / 10;

		if (cntTime < 10.0 && !time.hasClass("timeWarn")) {
			time.addClass("timeWarn");
			playDingDingDing();
		}
		if (cntTime < 0.1) {
			window.clearInterval(pid);
			showSplash("Out of time!");
			window.clearInterval(timeId);
			$(".splash.playagain").show();
		}

		time.text(strTime + " s");
	}, timeInterval);
}

function playDingDingDing() {
	var cntDing = 2;
	var ding = $("#ding")[0];
	ding.play();
	var dingdingdingId = window.setInterval(function() {
		console.log("ding");
		ding.play();
		cntDing--;
		if (cntDing === 0)
			window.clearInterval(dingdingdingId);
	}, 800);
}

function blinkArrows() {
	var blink = 0;
	var blinkId = window.setInterval(function() {
		var vis = $("#arrow1,#arrow2").css("visibility");
		$("#arrow1,#arrow2").css("visibility", vis === "hidden" ? "visible" : "hidden");
		if (blink++ >= 3) {
			window.clearInterval(blinkId);
			window.setTimeout(function() { $("#explanation").hide(); }, 1000);
		}
	}, 500);
}

function showDebug(deltaX, deltaY, deltaT) {
	$("#debug #dx").text(Math.round(deltaX * 100) / 100);
	$("#debug #dy").text(Math.round(deltaY * 100) / 100);
	$("#debug #dt").text(deltaT + " ms");
}

function draw() {
	var c = document.getElementById("myCanvas");
	var ctx = c.getContext("2d");

	var colors = [
		['blue', 'yellow'],
		['white', 'pink'],
		['green', 'red'],
		['white', 'black'],
		['green', 'blue'],
		['red', 'green', 'blue']
	];

	ctx.lineWidth = 21;

	for (var i = 0; i < 12; i++) {
		for (var cIdx = 0, r = 10; r <= 110; r += 20, cIdx++) {
			var cols = colors[cIdx];
			ctx.beginPath();
			ctx.arc(125, 125, r, (i - 1) * Math.PI / 6.0, i * Math.PI / 6.0);
			ctx.strokeStyle = cols[i % cols.length];
			ctx.stroke();
		}
	}
}

function rotate(deltaX, deltaY) {
	var animSteps = 100;
	var deg = 0;
	var c = document.getElementById("myCanvas");
	if (pid > 0)
		window.clearInterval(pid);
	var x = parseFloat($(c).css("left")), y = parseFloat($(c).css("top"));
	pid = window.setInterval(function() {
		x += deltaX * 5;
		y += deltaY * 5;
		c.style.left = Math.round(x) + "px", c.style.top = Math.round(y) + "px";
		c.style.transform = 'rotate(' + deg + 'deg)';
		deg = (deltaX > 0) ? deg + 4 : deg -4;

		checkIfLost();
		readDistance();

		if (animSteps-- === 0) {
			window.clearInterval(pid);
		}
	}, 10);
}

function checkIfLost() {
	var canvas = $("#myCanvas");
	var width = parseInt(canvas.css("width")), height = parseInt(canvas.css("height"));
	var left  = parseInt(canvas.css("left")),  top = parseInt(canvas.css("top"));
	if (left < -(width/2) || top < -(height/2)) {
		if (pid > 0)
			window.clearInterval(pid);
		showSplash("You're lost!<br>You lose 2s.");
		window.setTimeout(function() {
			hideSplash();
			resetPosition();
		}, 2000);
	}
}

function showSplash(h1Text, callback) {
	$(".splash.dummy h1").html(h1Text);
	$(".splash.dummy").show();

	if (callback === undefined) {
		$(".splash.dummy .click").click(function() {
			hideSplash();
		});
	} else {
		$(".splash.dummy .click").click(callback);
	}
}

function hideSplash() {
	$(".splash.dummy").hide();
}

function resetPosition() {
	var body = $("body"), finish = $("#finish");
	var width = parseInt(body.css("width")), height = parseInt(body.css("height"));
	var maxX = width - parseInt(finish.css("width"));
	var maxY = height - parseInt(finish.css("height"));
	$("#myCanvas").css("left", maxX / 2 + "px").css("top", maxY / 2 + "px");
}

function readDistance() {
	var cx = parseInt( $("#myCanvas").css("left") ), cy = parseInt( $("#myCanvas").css("top") );
	var fx = parseInt( $("#finish").css("left") ), fy = parseInt( $("#finish").css("top") );
	var distX = cx - fx, distY = cy - fy;
	var distXY = parseInt(Math.sqrt(distX * distX + distY * distY));
	$("#debug #dDist").text( Math.round(distXY * 100) / 100 );
	if (distXY < 256) {
		changeBgFinish(distXY);
		if (distXY < 50) {
			if (cntRemainFinishs-- <= 0) {
				window.clearInterval(timeId);
				window.clearInterval(pid);
				score += parseInt(cntTime * 100);
				$("#score").text(score);
				if (score > hiscore) {
					hiscore = score;
					$("#hiscore").text(hiscore);
				}
				
				showSplash("You made it", function() {
					console.log("callback in you made it");
					console.log($(this));
					$(this).click(function() {
						hideSplash();
						$(".splash.playagain").show();
					});
				});
			} else {
				moveFinish();
				score += 1000;
				$("#remGoals").text(cntRemainFinishs);
				$("#score").text(score);
			}
		}
	}
}

function changeBgFinish(distXY) {
	var bg = $("#finish").css("background-color"); // -> rgb(1,23,123)
	var rgbStr = bg.substring(4, bg.length-1);
	var rgb = rgbStr.split(",");
	var r = distXY, g = 255 - distXY, b = rgb[2];
	$("#finish").css("background-color", "rgb(" + r + "," + g + ", " + b + ")");
}

function moveFinish() {
	var body = $("body"), finish = $("#finish");
	var width = parseInt(body.css("width")), height = parseInt(body.css("height"));
	var maxX = width  - parseInt(finish.css("width"));
	var maxY = height - parseInt(finish.css("height"));
	var newX = parseInt(Math.random() * maxX), newY = parseInt(Math.random() * maxY);
	finish.css("left", newX + "px").css("top", newY + "px");
}

function showHiscores() {
	$(".splash.hiscores").show();
	var tbl = $(".hiscores table");
	for (var i = 0; i < CNT_HISCORES; i++) {
		tbl.find("tr:eq(" + (i+1) + ") td.score").text(hiscores[i].score);
		tbl.find("tr:eq(" + (i+1) + ") td.name").text(hiscores[i].name);
	}
}

function enterHiscore(myScore) {
	if (myScore === undefined) {
		console.warn("enterHiscore called without argument");
		return;
	}
	var tbl = $(".hiscores table");
	if (myScore > hiscores[CNT_HISCORES-1].score) {
		var pos = 0;
		for (pos = 0; pos < CNT_HISCORES; pos++) {
			if (myScore > hiscores[pos].score) {
				break;
			}
		}
		hiscores.splice(pos, 0, {name: "___", score: myScore});
		hiscores.splice(CNT_HISCORES,1);	// remove last element

		showHiscores();

		var inputTxt = "<input id='txtHiscoreName' type='text' onkeyup='finishHiscore(event, " + pos + ")' value=''/>";
		tbl.find("tr:eq(" + (pos+1) + ") td.score").text(myScore);
		tbl.find("tr:eq(" + (pos+1) + ") td.name").html(inputTxt);
	}
}

function finishHiscore(e, pos) {
	if (e.keyCode === 13) {
//		var trName = $("#txtHiscoreName").parent();
		var myName = $("#txtHiscoreName").val();
		$("#txtHiscoreName").remove();
		hiscores[pos] = { name : myName, score: $(".hiscores table td.score:eq(" + pos + ")").text() };
//		trName.text(myName);
		showHiscores();
	}
}