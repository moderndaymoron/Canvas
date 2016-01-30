"use strict";
function Point(x, y){
	this.x = x || 0;
	this.y = y || 0;
}

function Rect(x, y, maxX, maxY, pen){
	this.x 		= x;
	this.y 		= y;
	this.width  = maxX;
	this.height = maxY;
	if(pen){
		this.right  = maxX;
		this.bottom = maxY;		
	}
	else{
		this.right  = this.x + this.width;
		this.bottom = this.y + this.height;
	}
}

class Shape{
	constructor(x, y, color, lineWidth, type, fontFamily) {
		this.x          = x;
		this.y          = y;
		this.endX       = x;
		this.endY       = y;
		this.color      = color;
		this.type       = type;
		this.lineWidth  = lineWidth;
		this.selected   = false;
		this.bounds     = null;
		this.oldPoint   = new Point(x, y);
		this.fontFamily = fontFamily;
	}

	calcBounds(){
		if(this.type === "Pen"){
			var minX = Number.MAX_VALUE;
			var maxX = 0;
			var minY = Number.MAX_VALUE;
			var maxY = 0;

			for(var i = 0; i < this.penPoints.length; i++){
				if(this.penPoints[i].x < minX){
					minX = this.penPoints[i].x;
				}
				if(this.penPoints[i].x > maxX){
					maxX = this.penPoints[i].x;
				}
				if(this.penPoints[i].y < minY){
					minY = this.penPoints[i].y;
				}
				if(this.penPoints[i].y > maxY){
					maxY = this.penPoints[i].y;
				}
			}
			return new Rect(minX, minY, maxX, maxY, true);

		}
		else if(this.type === "Circle"){
			return new Rect(this.x - this.radius, this.y - this.radius, this.radius*2, this.radius*2, false);

		}
		else{
			var minX = Math.min(this.x, this.endX);
			var minY = Math.min(this.y, this.endY);
			var maxX = Math.abs(this.endX - this.x);
			var maxY = Math.abs(this.endY - this.y);
		}

		return new Rect(minX, minY, maxX, maxY, false);
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
		var padding = this.lineWidth/2;

		if(this.bounds.right + padding >= x && x >= this.bounds.x - padding && this.bounds.bottom + padding >= y && y >= this.bounds.y - padding){
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