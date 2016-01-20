"use strict";
var canvas 		  = null;
var context 	  = null;
var mouseIsDown   = false;
var currentColor  = "black";
var lineWidth     = 2;
var selectedShape = createRectangle;
var mode          = "draw";
var shapes		  = [];
var symbol		  = null;
var points        = null; 

function getPoints(e){
	return new Point(e.offsetX, e.offsetY);
}

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
	if (attrValue === "select"){
		this.mode = "select";
	}
	else{
		mode = "draw";
	}
	var functionName = "create" + attrValue;
	var res = eval(functionName);
	selectedShape = res;
	console.log(selectedShape)
	
}

function drawShapes(){
	for(var i = 0; i < shapes.length; i++){
		shapes[i].draw(context);
	}
}

$(document).ready(function(){
	$(".toolbox").click(changeTool);
	
	canvas = document.getElementById("myCanvas");
	context = canvas.getContext("2d");
	
	$("#myCanvas").mousedown(function (e){
		var mouseIsDown = true;
		points = getPoints(e);
		console.log("xy", points.x, points.y)
		symbol = selectedShape(points.x, points.y);
	});

	$("#myCanvas").mouseup(function(e){
		points = getPoints(e);
		symbol.setEnd(points.x, points.y);
		shapes.push(symbol);
		drawShapes();
	});		
});