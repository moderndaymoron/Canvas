"use strict";
class Text extends Shape {
	constructor(x, y, color, lineWidth, fontSize, fontFamily){
		super(x, y, color, lineWidth, "Text");
		this.message 	= "";
		this.fontSize   = fontSize;
		this.fontFamily = fontFamily;
	}

	draw(ctx){
		if (this.endX > G.canvas.width){
			this.x -= this.endX - G.canvas.width;
			this.setMessageAndBounds(this.message, this.bounds.width);
		}

		var fontInfo = this.fontSize + "px " + this.fontFamily;
		ctx.fillStyle = this.color;
		ctx.font = fontInfo;
		ctx.fillText(this.message, this.x, this.y);
		if(this.selected){
			ctx.strokeStyle = "black";
			ctx.lineWidth = 1;
			ctx.setLineDash([5,5]);
			ctx.strokeRect(this.x-5, this.y-this.bounds.height, this.bounds.width+10, this.bounds.height+10);
		}
	}

	move(ctx, e){

	}

    drag(ctx, e){
    	var newX = e.offsetX - (e.offsetX-this.x);
		var newY = e.offsetY - (e.offsetY-this.y);

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
		
		this.setOldPoint(e.offsetX, e.offsetY);
		ctx.clearRect(0, 0, G.canvas.width, G.canvas.height);
		this.draw(ctx);
		this.x = newX;
		this.y = newY;
		this.setEnd(newX + this.bounds.width, newY - this.bounds.height);
    }

    setMessageAndBounds(text, width){
    	this.endX 	 = this.x + width;
    	this.endY 	 = this.y - parseInt(this.fontSize);
    	this.message = text;
    	this.bounds  = this.calcBounds();
    }

    loadValues(shape){	    	
    	this.color 		= shape.color;
    	this.bounds 	= shape.bounds;
    	this.endX 		= shape.endX;
    	this.endY 		= shape.endY;
    	this.fontFamily = shape.fontFamily;
    	this.fontSize   = shape.fontSize;
    	this.lineWidth  = shape.lineWidth;
    	this.x 			= shape.x;
    	this.y 			= shape.y;
    	this.message 	= shape.message;
    }
}	
