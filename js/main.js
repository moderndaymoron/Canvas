"use strict";
var canvas 		  = null;
var context 	  = null;
var mouseIsDown   = false;
var currentColor  = "black"; //change this when color is picked    jquery
var lineWidth     = 2;		 //change this when pixel size is set  jquery
var fontSize	  = 12;		 //change this when fontsize is chosen
var selectedShape = createPen;
var mode          = "draw";
var shapes		  = [];
var undoShape	  = [];
var redoShape	  = [];
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
	console.log(attrValue);
	if (attrValue === "Select"){
		mode = "select";
		return;
	}

	mode = "draw";
	var functionName = "create" + attrValue;
	var res = eval(functionName);
	selectedShape = res;
}

function canvasUndo(){
	//needs propper implementation
	if(shapes.length < 1){
		return;
	}
	undoShape.push(shapes.pop());
	console.log(shapes);
	context.clearRect(0,0,canvas.width, canvas.height);
	drawShapes();
}

function canvasRedo(){
	if(undoShape.length < 1){
		return;
	}
	shapes.push(undoShape.pop());
	reDraw();
}

function checkIfPointInShape(x, y){
	for (var i = 0;  i < shapes.length; i++){
		shapes[i].selected = false;
	}
	for (var i = shapes.length-1; i >= 0; i--){
		if(shapes[i].isPointInShape(x,y)){
			shapes[i].selected = true;
			return shapes[i];
		}
	}
	return 0;
}

function drawShapes(){
	for (var i = 0; i < shapes.length; i++){
		shapes[i].draw(context);
	}
}

function reDraw(){
	context.clearRect(0,0,canvas.width, canvas.height);
	drawShapes();
}

$(document).ready(function(){
	$(".toolbox").click(changeTool);
	$("#undobutton").click(canvasUndo);
	$("#redobutton").click(canvasRedo);
	
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
		if(mode === "select"){
			symbol = checkIfPointInShape(points.x, points.y);

		}
		else{
			symbol = selectedShape(points.x, points.y);
			if(symbol.type === "Pen"){
				symbol.setInitialCoords();
			}
		}
	});

	$("#tmpCanvas").mousemove(function(e){
		if(mode === "select"){
			//TODO: move the shape on the canvas with effects still on
			if(mouseIsDown){
				console.log(symbol);
				symbol.drag(tmpContext, e);
				//reDraw();
			}

		}
		else if(mouseIsDown){
			symbol.move(tmpContext, e);
		}
	});

	$("#tmpCanvas").mouseup(function(e){
		mouseIsDown = false;
		points = getPoints(e);
		if(mode === "select"){
			//TODO: change the position of the element and take effects off
			return;
		}
		// Copying the content from the tmp canvas		
		else{
			context.drawImage(tmpCanvas, 0, 0);
			tmpContext.clearRect(0, 0, tmpCanvas.width, tmpCanvas.height);
			symbol.setEnd(points.x, points.y);
			shapes.push(symbol);
		}
		//reDraw();
	});		
});