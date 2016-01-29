"use strict";
function Point(x, y){
	this.x = x || 0;
	this.y = y || 0;
}

function Rect(x, y, maxX, maxY){
	this.x 		= x;
	this.y 		= y;
	this.width  = maxX;
	this.height = maxY;
	this.right  = this.x + this.width;
	this.bottom = this.y + this.height;
}

class Shape{
	constructor(x, y, color, lineWidth, type) {
		this.x         = x;
		this.y         = y;
		this.endX      = x;
		this.endY      = y;
		this.color     = color;
		this.type      = type;
		this.lineWidth = lineWidth;
		this.selected  = false;
		this.bounds    = null;
		this.oldPoint  = new Point(x, y);
	}

	calcBounds(){
		var minX = Math.min(this.x, this.endX);
		var minY = Math.min(this.y, this.endY);
		var maxX = Math.abs(this.endX - this.x);
		var maxY = Math.abs(this.endY - this.y);

		return new Rect(minX, minY, maxX, maxY);
	}

	setEnd(x,y,e){
		this.endX   = x;
		this.endY   = y;
		this.bounds = this.calcBounds();
	}

	setOldPoint(x, y){
		this.oldPoint.x = x;
		this.oldPoint.y = y;
	}

	isPointInShape(x, y){
		if(this.bounds.right >= x && x >= this.bounds.x && this.bounds.bottom >= y && y >= this.bounds.y){
			return true;
		}
		return false;
	}

	isSelected(ctx){
		if(this.selected === true){
			ctx.setLineDash([5, 5]);
		}
		else{
			ctx.setLineDash([0,0]);
		}
	}
}