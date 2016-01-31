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
var data 		  = null;
var tOrD          = null;

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
			shapes[i].bounds = shapes[i].calcBounds();
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
			shapes[i].bounds = shapes[i].calcBounds();
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
		console.log(shapes);
}

function showTextArea(e){
	var x 						= e.clientX - canvas.offsetLeft;
    var y 						= e.clientY - canvas.offsetTop;
	var textArea 				= document.getElementById("textinput");
	textArea.setAttribute("autofocus", true);
	textArea.style.fontFamily   = fontFamily;
	textArea.style.display 		= "inline-block";
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

function prompt(){
	swal({   
	title: "Save image",
	text: "Please insert the name of your drawing:",
	type: "input",
	showCancelButton: true,
	closeOnConfirm: false,
	animation: "slide-from-top",
	inputPlaceholder: "Name" 
	},

	function(inputValue){
   		if (inputValue === false) return false;
   
   		if (inputValue === "") {
        	swal.showInputError("You need to write something!");
        	return false
    	}
       swal({   
		title: "Template?",   
		text: "Would you like to save this as an template?",   
		type: "warning",   
		showCancelButton: true,   
		confirmButtonColor: "#DD6B55",   
		confirmButtonText: "Yes",   
		cancelButtonText: "No, save it as an image",   
		closeOnConfirm: false,   closeOnCancel: false
 		}, 
		function(isConfirm){
			if (isConfirm) {     
				swal.close();
				save(inputValue, true);
			} 
			
			else {
				swal.close();     
				save(inputValue, false);
			} 
		});
    
	});
}

function templatesOrDrawings(){
	swal({   
		title: "Load",   
		text: "Load templates or drawings?",   
		type: "warning",   
		showCancelButton: true,   
		confirmButtonColor: "#DD6B55",   
		confirmButtonText: "Templates",   
		cancelButtonText: "Drawings",   
		closeOnConfirm: false,   closeOnCancel: false
 		}, 
		function(isConfirm){
			if (isConfirm) {     
				swal.close();
				getSaved(true);
			} 
			
			else {
				swal.close();     
				getSaved(false);
			} 
	});
}

function save(name, template){
	var stringifiedShapes = JSON.stringify(shapes);
	
	var param = { 
				"user": "arnio13", // You should use your own username!
				"name": name,
				"content": stringifiedShapes,
				"template": template
			};

	$.ajax({
		type: "POST",
		contentType: "application/json; charset=utf-8",
		url: "http://whiteboard.apphb.com/Home/Save",
		data: param,
		dataType: "jsonp",
		crossDomain: true,
		success: function (data) {
   			swal("Nice!", name + " was saved successfully", "success");
		},
		error: function (xhr, err) {
			sweetAlert("Oops...", "Something went wrong! Error, if you're using the pen tool, that's likely the problem", "error");
		}
	});
}

function getSaved(template){
	if(template){
		tOrD = "template";
	}
	else{
		tOrD = "drawings";
	}

	var param = { 
				"user": "arnio13", // You should use your own username!
				"template": template
	};

	$.ajax({
			type: "POST",
			contentType: "application/json; charset=utf-8",
			url: "http://whiteboard.apphb.com/Home/GetList",
			data: param ,
			
			dataType: "jsonp",
			crossDomain: true,
			success: function (data) {
				addDrawingsToDropdown(data);
			},
			error: function (xhr, err) {
				sweetAlert("Oops...", "Something went wrong!", "error");
			}
	});
}

function addDrawingsToDropdown(drawings){
	var select = document.getElementById("dropdowndrawings");
	$("#dropdowndrawings").empty();
	for (var i = 0; i < drawings.length; i++){
		var drawing = document.createElement("OPTION");
		drawing.setAttribute("value", drawings[i].ID);
		var name = document.createTextNode(drawings[i].WhiteboardTitle);
		drawing.appendChild(name);
		select.appendChild(drawing);
	}
}

function loadDrawing(){
	var id = $("#dropdowndrawings").val();
	if (id == "0"){
		return;
	}
	load(id);
}

function load(drawingID){
	context.clearRect(0, 0, canvas.width, canvas.height);
	
	if (tOrD == "drawings"){
		shapes = [];		
	}


	var param = { 
			"id": drawingID
	};

	$.ajax({
			type: "POST",
			contentType: "application/json; charset=utf-8",
			url: "http://whiteboard.apphb.com/Home/GetWhiteboard",
			data: param ,
			
			dataType: "jsonp",
			crossDomain: true,
			success: function (data) {
				var loadedShapes = JSON.parse(data.WhiteboardContents);
				
				for(var i = 0; i < loadedShapes.length; i++){
					redrawFromLoad(loadedShapes[i]);
				}

				reDraw();
			
			},
			error: function (xhr, err) {
				sweetAlert("Oops...", "Something went wrong!", "error");
			}
		});	
}

function redrawFromLoad(shape){
	switch (shape.type) {    
	    case "Circle":
	    	var circle = new Circle();
	    	circle.loadValues(shape);
	    	shapes.push(circle);
	        break;

	    case "Pen":
	    	var pen = new Pen();
	    	pen.loadValues(shape);
			shapes.push(pen);
	        break;

	    case "Rectangle":
	    	var rectangle = new Rectangle();
	    	rectangle.loadValues(shape);
	    	shapes.push(rectangle);
	        break;

	    case "Line":
	    	var line = new Line();
	    	line.loadValues(shape);
	    	shapes.push(line);
	        break;

	    case "Text":
	    	var text = new Text();
	    	text.loadValues(shape);
	    	shapes.push(text);
	        break;
	}
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
	$("#savedrawing").click(prompt);
	$("#getDrawing").click(templatesOrDrawings);
	$("#loadDrawing").click(loadDrawing);
	$("#textinput").keyup(function(e){
		if(e.keyCode === 13){
			submitText(symbol);
			shapes.push(symbol);
			reDraw();
		}
		else if(e.keyCode === 27){
			hideTextArea();
		}
	});
	$("body").keyup(function(e){
		if(e.keyCode === 8 || e.keyCode === 46){
			canvasDelete();
		}
	});
	$("body").keydown(function(e){
		if(e.keyCode === 90 && e.ctrlKey){
			canvasUndo();
		}
		else if(e.keyCode === 89 && e.ctrlKey){
			canvasRedo();
		}
	});
	$("#fontsize").on('change', function(){
		fontSize = $(this).val();
		for (var i = 0; i < shapes.length; i++){
			if(shapes[i].selected){
				shapes[i].fontSize = fontSize;
			  	context.font   	   = fontSize + "px " + fontFamily;
				var textWidth  	   = context.measureText(shapes[i].message).width;
				shapes[i].setMessageAndBounds(shapes[i].message, textWidth);
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
		console.log("mousemove");
		if(mode === "select"){
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
		console.log("mouseup");
		mouseIsDown = false;	
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

		reDraw();
	});
});
