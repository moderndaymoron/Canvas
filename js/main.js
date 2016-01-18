"use strict";

var mouseIsDown  = false;
var currentColor = "black";
var lineWidth    = 2;
var shape        = "Rectangle";

$(document).ready(function(){

	var canvas = document.getElementById("myCanvas");
	var context = canvas.getContext("2d");

	$("#myCanvas").mousedown(function (e){
		var x = e.offsetX;
		var y = e.offsetY;
		var mouseIsDown = true;
		
		if(shape == "Rectangle"){
			var symbol = new Rectangle(x, y, currentColor, lineWidth);
			
			$("#myCanvas").mouseup(function(e){
				symbol.setEnd(e.offsetX, e.offsetY);
				symbol.draw(x, y, context);
			});
		}		
	});

});