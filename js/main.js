"use strict";
var canvas 		  = null;
var context 	  = null;
var mouseIsDown   = false;
var currentColor  = "black";
var lineWidth     = 2;		 
var fontSize	  = 14;
var fontFamily	  = "Arial";
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

function createTemplate(x, y){
	return new Template(x, y, currentColor, lineWidth);
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
	return new Text(x, y, currentColor, lineWidth, fontSize, fontFamily);
}

function createEraser(x, y){
	return new Pen(x, y, "#fff", lineWidth);
}

function changeTool(){
	var attrValue = $(this).attr("data-tool");
	console.log(attrValue);
	if (attrValue === "Select"){
		mode = "select";
		return;
	}

	mode = "draw";
	setSelectedFalse();
	var functionName = "create" + attrValue;
	var res = eval(functionName);
	selectedShape = res;
	reDraw();
}

function canvasUndo(){
	if(shapes.length < 1){
		return;
	}

	undoShape.push(shapes.pop());
	console.log(shapes);
	reDraw();
}

function canvasRedo(){
	if(undoShape.length < 1){
		return;
	}

	shapes.push(undoShape.pop());
	reDraw();
}

function canvasDelete(){
	for (var i = 0; i < shapes.length; i++){
		console.log("canvasDelete()");
		if(shapes[i].selected){
			undoShape.push(shapes[i]);
			shapes.splice(i, 1);
		}
	}

	reDraw();
}

function canvasIncRadius(){
	if(lineWidth >= 50){
		return;
	}

	lineWidth += 1;
	$("#radVal").html(lineWidth);
}

function canvasDecRadius(){
	if(lineWidth <= 1){
		return;
	}

	lineWidth -= 1;
	$("#radVal").html(lineWidth);
}

function canvasColor(){
	var attrValue = $(this).attr("data-tool");
	var res = eval(attrValue);
	currentColor = attrValue || "black";
}

function checkIfPointInShape(x, y, e){
	setSelectedFalse();
	for (var i = shapes.length-1; i >= 0; i--){
		if(shapes[i].isPointInShape(x,y)){
			shapes[i].selected = true;
			shapes[i].setOldPoint(e.offsetX, e.offsetY);
			return shapes[i];
		}
	}

	return 0;
}

function drawShapes(){
	console.log(shapes);
	for (var i = 0; i < shapes.length; i++){
		shapes[i].draw(context);
	}
}

function reDraw(){
		context.clearRect(0,0,canvas.width, canvas.height);
		drawShapes();
}

function showTextArea(){
	if (mode === "text") {
		$("#textArea").css('display', 'inline-block');
	}
}

function setContextColorAndWidth(ctx, symbol){
	ctx.strokeStyle = symbol.color;
	ctx.lineWidth = symbol.lineWidth;
}

function setSelectedFalse(){
	for (var i = 0;  i < shapes.length; i++){
		shapes[i].selected = false;
	}
}

$(document).ready(function(){
	$(".toolbox").click(changeTool);
	$("#undobutton").click(canvasUndo);
	$("#redobutton").click(canvasRedo);
	$("#delbutton").click(canvasDelete);
	$("#incrad").click(canvasIncRadius);
	$("#decrad").click(canvasDecRadius);
	$(".colors").click(canvasColor);
	$("myCanvas").click(showTextArea);
	$("#templatebutton").click(canvasTemplate);
	$("#drawtemplate").click(canvasDrawTemplate);
	$("#textinput").keypress(function(e){
		if(e.keyCode === 13){
			var msg = $("#textinput").val();
			var textWidth = context.measureText(msg).width;
			symbol.setMessageAndBounds(msg, textWidth);
			var textArea  		   = document.getElementById("textinput");
			textArea.value 		   = "";
			textArea.style.display = "none";
			shapes.push(symbol);
			reDraw();
		}
	});
	$("#fontsize").on('change', function(){
		fontSize = $(this).val();
	});
	$("#fontfamily").on('change', function(){
		fontFamily = $(this).val();
		console.log(fontFamily);
	});

	canvas = document.getElementById("myCanvas");
	context = canvas.getContext("2d");

	// tmp canvas
	var tmpCanvas = document.createElement('canvas');
	var tmpContext = tmpCanvas.getContext('2d');
	var canvases = document.querySelector('#canvases');
	tmpContext.lineWidth = 25;
	context.lineWidth = lineWidth;
	tmpCanvas.id = 'tmpCanvas';
	tmpCanvas.width = canvas.width;
	tmpCanvas.height = canvas.height;

	canvases.appendChild(tmpCanvas);

/*	var img = new Image();
	img.onload = function() {
		context.drawImage(img, -10, -12, 740, 530);
	}
	img.src = "img/whiteboard.svg"; */

	$("#tmpCanvas").mousedown(function (e){
		mouseIsDown = true;
		points = getPoints(e);
		if(mode === "select"){
			symbol = checkIfPointInShape(points.x, points.y, e);
			canvasDelete();
		}
		else{
			symbol = selectedShape(points.x, points.y);
			console.log(symbol);
			if(symbol.type === "Pen"){
				symbol.setInitialCoords();
			}
			else if(symbol.type === "Text"){
				mouseIsDown = false;
				symbol = selectedShape(points.x, points.y);
				console.log(symbol);
				document.getElementById("textinput").style.display = "block";
			}
		}
		setContextColorAndWidth(tmpContext, symbol);
	});

	$("#tmpCanvas").mousemove(function(e){
		if(mode === "select"){
			//TODO: move the shape on the canvas with effects still on
			if(mouseIsDown){
				console.log(symbol);
				if(symbol != 0){
					tmpContext.setLineDash([5, 5]);
					symbol.drag(tmpContext, e, points.x, points.y);
					tmpContext.setLineDash([0, 0]);
				}
				else{
					return;
				}
			}

		}
		else if(mouseIsDown){
			symbol.move(tmpContext, e);
		}
	});

	$("#tmpCanvas").mouseup(function(e){
		if(!mouseIsDown){

		}
		else{
			points = getPoints(e);
			if(mode === "select"){
				if(symbol != 0){
					context.drawImage(tmpCanvas, 0, 0);
					tmpContext.clearRect(0, 0, tmpCanvas.width, tmpCanvas.height);
					shapes.push(symbol);
				}
			}
			else{
				context.drawImage(tmpCanvas, 0, 0);
				tmpContext.clearRect(0, 0, tmpCanvas.width, tmpCanvas.height);
				symbol.setEnd(points.x, points.y);
				shapes.push(symbol);
			}
		}

		mouseIsDown = false;
		reDraw();
	});
});
