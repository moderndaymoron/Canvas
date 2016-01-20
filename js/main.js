"use strict";

var mouseIsDown   = false;
var currentColor  = "black";
var lineWidth     = 2;
var selectedShape = createRectangle;
var mode          = "draw";
var shapes		  = []; 

//Factory functions
function createRectangle(x, y){
	return new Rectangle(x, y, currentColor, lineWidth);
}
function createLine(x, y){
	console.log("increateLine");
	return new Line(x, y, currentColor, lineWidth);
}
//create function for each shape

function changeTool(){
	var attrValue = $(this).attr("data-tool");
	console.log(attrValue)
	if (attrValue === "select"){
		this.mode = "select";
	}
	else{
		mode = "draw";
	}
	var functionName = "create" + attrValue;
	var res = eval(functionName);
	this.selectedShape = res;
}

function drawShapes(){
	for(var i = 0; i < shapes.length; i++){
		console.log("drawshapes");
		console.log(shapes[i]);
		shapes[i].draw(document.getElementById("myCanvas").getContext("2d"));
	}
}
$(document).ready(function(){
	$(".toolbox").click(changeTool);
	var canvas = document.getElementById("myCanvas");
	var context = canvas.getContext("2d");

	$("#myCanvas").mousedown(function (e){
		var x = e.offsetX;
		var y = e.offsetY;
		var mouseIsDown = true;
		var symbol = selectedShape(x,y);
			
			$("#myCanvas").mouseup(function(e){
				symbol.setEnd(e.offsetX, e.offsetY);
				shapes.push(symbol);
				drawShapes();
				//symbol.draw(x, y, context);
			});		
	});

});