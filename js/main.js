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
	hideTextArea();
	var attrValue = $(this).attr("data-tool");
	console.log(attrValue);
	if (attrValue === "Select"){
		mode = "select";
		return;
	}

	mode 			 = "draw";
	var functionName = "create" + attrValue;
	var res 		 = eval(functionName);
	selectedShape 	 = res;
	setSelectedFalse();
	reDraw();
}

function canvasUndo(){
	if(shapes.length < 1){
		return;
	}

	undoShape.push(shapes.pop());
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
	for (var i = 0; i < shapes.length; i++){
		if(shapes[i].selected){
			shapes[i].lineWidth = lineWidth;
			reDraw();
		}
	}
}

function canvasDecRadius(){
	if(lineWidth <= 1){
		return;
	}

	lineWidth -= 1;
	$("#radVal").html(lineWidth);
	for (var i = 0; i < shapes.length; i++){
		if(shapes[i].selected){
			shapes[i].lineWidth = lineWidth;
			reDraw();
		}
	}
}

function canvasColor(){
	var attrValue = $(this).attr("data-tool");
	var res = eval(attrValue);
	currentColor = attrValue || "black";
	for (var i = 0; i < shapes.length; i++){
		if(shapes[i].selected){
			shapes[i].color = currentColor;
			reDraw();
		}
	}
}

function checkIfPointInShape(x, y, e){
	setSelectedFalse();
	for (var i = shapes.length-1; i >= 0; i--){
		if(shapes[i].isPointInShape(x,y)){
			shapes[i].selected = true;
			shapes[i].setOldPoint(e.offsetX, e.offsetY);
			console.log(shapes[i]);
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

function showTextArea(e){
	var x 						= e.clientX - canvas.offsetLeft;
    var y 						= e.clientY - canvas.offsetTop;
	var textArea 				= document.getElementById("textinput");
	textArea.style.fontFamily   = fontFamily;
	textArea.style.display 		= "inline";
    textArea.style.lineHeight   = fontSize + "px";
    textArea.style.fontSize     = fontSize + "px";
    textArea.style.top  		= e.clientY + 'px';
    textArea.style.left 		= e.clientX + 'px';
}

function submitText(symbol){
	var msg 			   = $("#textinput").val();
	context.font 		   = fontSize + "px " + fontFamily;
	var textWidth 		   = context.measureText(msg).width;
	hideTextArea();
	symbol.setMessageAndBounds(msg, textWidth);
}

function hideTextArea(){
	var textArea  		   = document.getElementById("textinput");
	textArea.value 		   = "";
	textArea.style.display = "none";
}
function setContextColorAndWidth(ctx, symbol){
	ctx.strokeStyle = symbol.color;
	ctx.lineWidth   = symbol.lineWidth;
}

function setSelectedFalse(){
	for (var i = 0;  i < shapes.length; i++){
		shapes[i].selected = false;
	}
}

function save(){
	var stringifiedArray = JSON.stringify(shapes);
	var param = { 
				"user": "arnio13", // You should use your own username!
				"name": "test",
				"content": stringifiedArray,
				"template": true
			};

	$.ajax({
		type: "POST",
		contentType: "application/json; charset=utf-8",
		url: "http://whiteboard.apphb.com/Home/Save",
		data: param,
		dataType: "jsonp",
		crossDomain: true,
		success: function (data) {
			alert("Saved")
		},
		error: function (xhr, err) {
			alert("Errrrrr")
		}
	});
}

function getSaved(){
	var param = { 
				"user": "arnio13", // You should use your own username!
				"template": true
	};

	$.ajax({
			type: "POST",
			contentType: "application/json; charset=utf-8",
			url: "http://whiteboard.apphb.com/Home/GetList",
			data: param ,
			
			dataType: "jsonp",
			crossDomain: true,
			success: function (data) {
				alert(data);
			},
			error: function (xhr, err) {
				alert("err");
			}
		});
}

$(document).ready(function(){
	//Event listeners
	$(".toolbox").click(changeTool);
	$("#undobutton").click(canvasUndo);
	$("#redobutton").click(canvasRedo);
	$("#delbutton").click(canvasDelete);
	$("#incrad").click(canvasIncRadius);
	$("#decrad").click(canvasDecRadius);
	$(".colors").click(canvasColor);
	$("myCanvas").click(showTextArea);
	$("#savedrawing").click(save);
	$("#senddrawing").click(getSaved);
	$("#textinput").keyup(function(e){
		console.log(e);
		if(e.keyCode === 13){
			submitText(symbol);
			shapes.push(symbol);
			reDraw();
		}
		else if(e.keyCode === 27){
			hideTextArea();
		}
	});
	$("#fontsize").on('change', function(){
		fontSize = $(this).val();
		for (var i = 0; i < shapes.length; i++){
			if(shapes[i].selected){
				shapes[i].fontSize = fontSize;
				reDraw();
			}
		}

	});
	$("#fontfamily").on('change', function(){
		fontFamily = $(this).val();
		for (var i = 0; i < shapes.length; i++){
			if(shapes[i].selected){
				shapes[i].fontFamily = fontFamily;
				reDraw();
			}
		}
	});

	canvas 				= document.getElementById("myCanvas");
	context 			= canvas.getContext("2d");
	var tmpCanvas 		= document.createElement('canvas');
	var tmpContext 		= tmpCanvas.getContext('2d');
	var canvases 		= document.querySelector('#canvases');
	context.lineWidth 	= lineWidth;
	tmpCanvas.id 		= 'tmpCanvas';
	tmpCanvas.width 	= canvas.width;
	tmpCanvas.height 	= canvas.height;

	canvases.appendChild(tmpCanvas);

	$("#tmpCanvas").mousedown(function (e){
		mouseIsDown = true;
		points = getPoints(e);
		console.log(points);
		if(mode === "select"){
			symbol = checkIfPointInShape(points.x, points.y, e);
			canvasDelete();
		}
		else{
			symbol = selectedShape(points.x, points.y);
			if(symbol.type === "Pen"){
				symbol.setInitialCoords();
			}
			else if(symbol.type === "Text"){
				mouseIsDown = false;
				symbol = selectedShape(points.x, points.y);
				showTextArea(e);
			}
		}

		setContextColorAndWidth(tmpContext, symbol);
	});

	$("#tmpCanvas").mousemove(function(e){
		if(mode === "select"){
			//TODO: move the shape on the canvas with effects still on
			if(mouseIsDown){
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
			symbol.move(tmpContext, e, points);
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
