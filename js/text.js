"use strict";
class Text extends Shape {
	constructor(x, y, color, lineWidth, fontSize, fontFamily){
		console.log("creating text");
		super(x, y, color, lineWidth, "Text");
		this.message = "";
		this.fontSize = fontSize;
		this.fontFamily = fontFamily;
	}

	draw(ctx){
		isSelected(ctx);
		var fontInfo = this.fontSize + "px " + this.fontFamily;
		ctx.strokeStyle = this.color;
		ctx.font = fontInfo;
		ctx.linewidth = this.lineWidth;
		ctx.strokeText(this.message, this.x, this.y);
	}

	move(ctx, e){

	}

    drag(ctx, e){

    }

    setMessageAndBounds(text, widht){
    	this.endX = this.x + widht;
    	this.endY = this.y + this.fontSize;
    	this.message = text;
    	this.bounds = this.calcBounds();
    	console.log(this);
    }
}	
