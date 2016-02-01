"use strict";
var G = {
	canvas 		  : null,
	context 	  : null,
	mouseIsDown   : false,
	currentColor  : "black",
	lineWidth     : 2,
	fontSize	  : 14,
	fontFamily	  : "Arial",
	selectedShape : createPen,
	mode          : "draw",
	shapes		  : [],
	undoShape	  : [],
	redoShape	  : [],
	symbol		  : null,
	points        : null,
	tOrD          : null
};

function getPoints(e){
	return new Point(e.offsetX, e.offsetY);
}

function createRectangle(x, y){
	return new Rectangle(x, y, G.currentColor, G.lineWidth);
}

function createLine(x, y){
	return new Line(x, y, G.currentColor, G.lineWidth);
}

function createCircle(x, y){
	return new Circle(x, y, G.currentColor, G.lineWidth);
}

function createPen(x, y){
	return new Pen(x, y, G.currentColor, G.lineWidth);
}

function createText(x, y){
	return new Text(x, y, G.currentColor, G.lineWidth, G.fontSize, G.fontFamily);
}

function createEraser(x, y){
	return new Pen(x, y, "#fff", G.lineWidth);
}

function changeTool(){
	hideTextArea();
	var attrValue = $(this).attr("data-tool");
	if (attrValue === "Select"){
		G.mode = "select";
		return;
	}

	G.mode 			 = "draw";
	var functionName = "create" + attrValue;
	G.selectedShape  = eval(functionName);
	setSelectedFalse();
	reDraw();
}

function canvasUndo(G){
	if(G.shapes.length < 1){
		return;
	}

	G.undoShape.push(G.shapes.pop());
	this.reDraw(G);
}

function canvasRedo(G){
	if(G.undoShape.length < 1){
		return;
	}

	G.shapes.push(G.undoShape.pop());
	reDraw();
}

function canvasDelete(){
	for (var i = 0; i < G.shapes.length; i++){
		if(G.shapes[i].selected){
			G.undoShape.push(G.shapes[i]);
			G.shapes.splice(i, 1);
		}
	}

	reDraw();
}

function canvasIncRadius(){
	if(G.lineWidth >= 50){
		return;
	}

	G.lineWidth += 1;
	$("#radVal").html(G.lineWidth);
	for (var i = 0; i < G.shapes.length; i++){
		if(G.shapes[i].selected){
			G.shapes[i].lineWidth = G.lineWidth;
			G.shapes[i].bounds = G.shapes[i].calcBounds();
			reDraw();
		}
	}
}

function canvasDecRadius(){
	if(G.lineWidth <= 1){
		return;
	}

	G.lineWidth -= 1;
	$("#radVal").html(lineWidth);
	for (var i = 0; i < G.shapes.length; i++){
		if(G.shapes[i].selected){
			G.shapes[i].lineWidth = G.lineWidth;
			G.shapes[i].bounds = G.shapes[i].calcBounds();
			reDraw();
		}
	}
}

function canvasColor(){
	var attrValue = $(this).attr("data-tool");
	var res = eval(attrValue);
	G.currentColor = attrValue || "black";
	for (var i = 0; i < G.shapes.length; i++){
		if(G.shapes[i].selected){
			G.shapes[i].color = G.currentColor;
			reDraw();
		}
	}
}

function checkIfPointInShape(x, y, e){
	setSelectedFalse();
	for (var i = G.shapes.length-1; i >= 0; i--){
		if(G.shapes[i].isPointInShape(x,y)){
			G.shapes[i].selected = true;
			G.shapes[i].setOldPoint(e.offsetX, e.offsetY);
			return G.shapes[i];
		}
	}

	return 0;
}

function drawShapes(){
	for (var i = 0; i < G.shapes.length; i++){
		G.shapes[i].draw(G.context);
	}
}

function reDraw(){
		G.context.clearRect(0,0,G.canvas.width, G.canvas.height);
		drawShapes();
}

function showTextArea(e){
	var textArea 				= document.getElementById("textinput");
	textArea.setAttribute("autofocus", true);
	textArea.style.fontFamily   = G.fontFamily;
	textArea.style.display 		= "inline-block";
    textArea.style.lineHeight   = G.fontSize + "px";
    textArea.style.fontSize     = G.fontSize + "px";
    textArea.style.top  		= e.clientY + "px";
    textArea.style.left 		= e.clientX + "px";
}

function submitText(symbol){
	var msg 			   = $("#textinput").val();
	G.context.font 		   = G.fontSize + "px " + G.fontFamily;
	var textWidth 		   = G.context.measureText(msg).width;
	hideTextArea();
	G.symbol.setMessageAndBounds(msg, textWidth);
}

function hideTextArea(){
	var textArea  		   = document.getElementById("textinput");
	textArea.value 		   = "";
	textArea.style.display = "none";
}
function setContextColorAndWidth(ctx, symbol){
	ctx.strokeStyle = G.symbol.color;
	ctx.lineWidth   = G.symbol.lineWidth;
}

function setSelectedFalse(){
	for (var i = 0;  i < G.shapes.length; i++){
		G.shapes[i].selected = false;
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
        	return false;
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
	$("#getDrawing").removeClass('highlight');
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
	var stringifiedShapes = JSON.stringify(G.shapes);

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
		G.tOrD = "template";
	}
	else{
		G.tOrD = "drawings";
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
	if (id === "0"){
		return;
	}

	load(id);
}

function load(drawingID){
	G.context.clearRect(0, 0, G.canvas.width, G.canvas.height);

	if (G.tOrD === "drawings"){
		G.shapes = [];
	}


	var param = {
			"id": drawingID
	};

	$.ajax({
			type: "POST",
			contentType: "application/json; charset=utf-8",
			url: "http://whiteboard.apphb.com/Home/GetWhiteboard",
			data: param,

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
	    	G.shapes.push(circle);
	        break;

	    case "Pen":
	    	var pen = new Pen();
	    	pen.loadValues(shape);
			G.shapes.push(pen);
	        break;

	    case "Rectangle":
	    	var rectangle = new Rectangle();
	    	rectangle.loadValues(shape);
	    	G.shapes.push(rectangle);
	        break;

	    case "Line":
	    	var line = new Line();
	    	line.loadValues(shape);
	    	G.shapes.push(line);
	        break;

	    case "Text":
	    	var text = new Text();
	    	text.loadValues(shape);
	    	G.shapes.push(text);
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
			submitText(G.symbol);
			G.shapes.push(G.symbol);
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
		G.fontSize = $(this).val();
		for (var i = 0; i < G.shapes.length; i++){
			if(G.shapes[i].selected){
				G.shapes[i].fontSize   = G.fontSize;
			  	G.context.font   	   = G.fontSize + "px " + G.fontFamily;
				var textWidth  	       = G.context.measureText(G.shapes[i].message).width;
				G.shapes[i].setMessageAndBounds(G.shapes[i].message, textWidth);
				reDraw();
			}
		}

	});
	$("#fontfamily").on('change', function(){
		G.fontFamily = $(this).val();
		for (var i = 0; i < G.shapes.length; i++){
			if(G.shapes[i].selected){
				G.shapes[i].fontFamily = G.fontFamily;
				reDraw();
			}
		}
	});
	$("#hotkeys").click(function(){
		var rules = $("#hotkeyslist");
		rules.fadeIn(1000);
		rules.fadeOut(7000);
	});

	G.canvas 				= document.getElementById("myCanvas");
	G.context 			= G.canvas.getContext("2d");
	var tmpCanvas 		= document.createElement('canvas');
	var tmpContext 		= tmpCanvas.getContext('2d');
	var canvases 		= document.querySelector('#canvases');
	G.context.lineWidth = G.lineWidth;
	tmpCanvas.id 		= 'tmpCanvas';
	tmpCanvas.width 	= G.canvas.width;
	tmpCanvas.height 	= G.canvas.height;

	canvases.appendChild(tmpCanvas);

	$("#tmpCanvas").mousedown(function (e){
		G.mouseIsDown = true;
		G.points = getPoints(e);
		if(G.mode === "select"){
			G.symbol = checkIfPointInShape(G.points.x, G.points.y, e);
			canvasDelete();
		}
		else{
			G.symbol = G.selectedShape(G.points.x, G.points.y);
			if(G.symbol.type === "Pen"){
				G.symbol.setInitialCoords();
			}
			else if(G.symbol.type === "Text"){
				G.mouseIsDown = false;
				G.symbol = G.selectedShape(G.points.x, G.points.y);
				showTextArea(e);
			}
		}

		setContextColorAndWidth(tmpContext, G.symbol);
	});

	$("#tmpCanvas").mousemove(function(e){
		if(G.mode === "select"){
			if(G.mouseIsDown){
				if(G.symbol != 0){
					tmpContext.setLineDash([5, 5]);
					G.symbol.drag(tmpContext, e, G.points.x, G.points.y);
					tmpContext.setLineDash([0, 0]);
				}
				else{
					return;
				}
			}
		}
		else if(G.mouseIsDown){
			G.symbol.move(tmpContext, e, G.points);
		}
	});

	$("#tmpCanvas").mouseup(function(e){
		G.mouseIsDown = false;
		G.points = getPoints(e);
		if(G.mode === "select"){
			if(G.symbol !== 0){
				G.context.drawImage(tmpCanvas, 0, 0);
				tmpContext.clearRect(0, 0, tmpCanvas.width, tmpCanvas.height);
				G.shapes.push(G.symbol);
			}
		}
		else{
			G.context.drawImage(tmpCanvas, 0, 0);
			tmpContext.clearRect(0, 0, tmpCanvas.width, tmpCanvas.height);
			G.symbol.setEnd(G.points.x, G.points.y);
			G.shapes.push(G.symbol);
		}

		reDraw();
	});
});
