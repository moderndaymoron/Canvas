"use strict";
class Rectangle extends Shape {
	constructor(x, y, color, lineWidth){
		super(x, y, color, lineWidth, "Rectangle");
	}

	draw(ctx){
		this.isSelected(ctx);
		ctx.lineWidth   = this.lineWidth;
		ctx.strokeStyle = this.color;		
		ctx.strokeRect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
		ctx.setLineDash([0,0]);
	}

	move(ctx, e){
		var x 		= Math.min(e.offsetX, this.x);
		var y 		= Math.min(e.offsetY, this.y);
		var width 	= Math.abs(e.offsetX - this.x);
		var height 	= Math.abs(e.offsetY - this.y);
		ctx.strokeStyle = this.color;
		ctx.clearRect(0, 0, G.canvas.width, G.canvas.height);
		ctx.strokeRect(x, y, width, height);
	}

	drag(ctx, e, x, y){
		var newX = e.offsetX - (e.offsetX-this.bounds.x);
		var newY = e.offsetY - (e.offsetY-this.bounds.y);

		if(e.offsetX > this.oldPoint.x){
			newX += e.offsetX - this.oldPoint.x;
		}
		else if(e.offsetX < this.oldPoint.x){
			newX -= Math.abs(this.oldPoint.x - e.offsetX);
		}
		if(e.offsetY > this.oldPoint.y){
			newY += e.offsetY - this.oldPoint.y;
		}
		else if(e.offsetY < this.oldPoint.y){
			newY -= Math.abs(this.oldPoint.y - e.offsetY);
		}

		if(this.isOutOfBounds(newX, newX + this.bounds.width, newY, newY + this.bounds.height)){
			return;
		}

		this.setOldPoint(e.offsetX, e.offsetY);
		ctx.clearRect(0, 0, G.canvas.width, G.canvas.height);
		ctx.strokeRect(newX, newY, this.bounds.width, this.bounds.height);
		this.x = newX;
		this.y = newY;
		this.setEnd(newX + this.bounds.width, newY + this.bounds.height);
	}

	loadValues(shape){
    	this.color 	   = shape.color;
    	this.lineWidth = shape.lineWidth;
    	this.x 		   = shape.x;
    	this.y 		   = shape.y;
    	this.endX 	   = shape.endX;
    	this.endY 	   = shape.endY;
    	this.bounds    = shape.bounds;
	}
}