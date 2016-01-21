"use strict";
var canvas 		  = null;
var context 	  = null;
var mouseIsDown   = false;
var currentColor  = "black"; //change this when color is picked    jquery
var lineWidth     = 2;		 //change this when pixel size is set  jquery
var fontSize	  = 12;		 //change this when fontsize is chosen
var selectedShape = createRectangle;
var mode          = "draw";
var shapes		  = [];
var symbol		  = null;
var points        = null; 

function getPoints(e){
	return new Point(e.offsetX, e.offsetY);
}

function createRectangle(x, y){
	return new Rectangle(x, y, currentColor, lineWidth);
}

function createLine(x, y){
	return new Line(x, y, currentColor, lineWidth);
}

function createCircle(x, y){
	return new Circle(x, y, currentColor, lineWidth);
}

function createPen(x, y){
	return new Pen(x, y, currentColor, lineWidth);
}

function createText(x, y){
	return new Text(x, y, currentColor, fontSize);
}

function createEraser(x, y){
	return new Eraser(x, y, "#fff", lineWidth);
}

function changeTool(){
	var attrValue = $(this).attr("data-tool");
	if (attrValue === "Select"){
		mode = "select";
		//TODO: do something when select is chosen
		return;
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

	// tmp canvas
	var tmpCanvas = document.createElement('canvas');
	var tmpContext = tmpCanvas.getContext('2d');
	var canvases = document.querySelector('#canvases');
	
	tmpCanvas.id = 'tmpCanvas';
	tmpCanvas.width = canvas.width;
	tmpCanvas.height = canvas.height;
	
	canvases.appendChild(tmpCanvas);
	
	$("#tmpCanvas").mousedown(function (e){
		mouseIsDown = true;
		points = getPoints(e);
		//console.log("xy", points.x, points.y)
		symbol = selectedShape(points.x, points.y);
	});

	$("#tmpCanvas").mousemove(function(e){
		if(mouseIsDown){
			symbol.move(tmpContext, e);
		}
	});

	$("#tmpCanvas").mouseup(function(e){
		mouseIsDown = false;
		points = getPoints(e);

		// Copying the content from the tmp canvas		
		context.drawImage(tmpCanvas, 0, 0);
		tmpContext.clearRect(0, 0, tmpCanvas.width, tmpCanvas.height);
		symbol.setEnd(points.x, points.y);
		shapes.push(symbol);
	});		
});