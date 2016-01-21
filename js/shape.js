"use strict";
function Point(x, y){
	this.x = x || 0;
	this.y = y || 0;
}

function Rect(x, y, maxX, maxY){
	this.x = x;
	this.y = y;
	this.maxX = maxX;
	this.maxY = maxY;
	this.right = this.x + this.maxX;
	this.bottom = this.y + this.maxY;
}

class Shape{
	constructor(x, y, color, LineWidth, type) {
		this.x         = x;
		this.y         = y;
		this.endX      = x;
		this.endY      = y;
		this.color     = color;
		this.type      = type;
		this.LineWidth = LineWidth;
		this.selected  = false;
	}

	calcBounds(){
		var minX = Math.min(this.x, this.endX);
		var minY = Math.min(this.y, this.endY);
		var maxX = Math.abs(this.endX - this.x);
		var maxY = Math.abs(this.endY - this.y);

		return new Rect(minX, minY, maxX, maxY);
	}

	setEnd(x,y,e){
		this.endX = x;
		this.endY = y;
	}

	isPointInShape(x, y){
		var bounds = this.calcBounds();
		console.log(x, y);
		console.log(bounds);
		if(bounds.right >= x && x >= bounds.x && bounds.bottom >= y && y >= bounds.y){
			return true;
		}
		return false;
	}
}