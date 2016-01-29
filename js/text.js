"use strict";
class Text extends Shape {
	constructor(x, y, color, lineWidth, fontSize, fontFamily){
		super(x, y, color, lineWidth, "Text");
		this.message = "";
		this.fontSize = fontSize;
		this.fontFamily = fontFamily;
	}

	draw(ctx){
		this.isSelected(ctx);
		var fontInfo = this.fontSize + "px " + this.fontFamily;
		ctx.strokeStyle = this.color;
		ctx.font = fontInfo;
		ctx.linewidth = this.lineWidth;
		ctx.strokeText(this.message, this.x, this.y);
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
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		this.draw(ctx);
		this.x = newX;
		this.y = newY;
		this.setEnd(newX + this.bounds.width, newY - this.bounds.height);
    }

    setMessageAndBounds(text, width){
    	this.endX = this.x + width;
    	this.endY = this.y - parseInt(fontSize);
    	this.message = text;
    	this.bounds = this.calcBounds();
    }
}	
