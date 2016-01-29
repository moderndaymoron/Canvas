"use strict";
class Text extends Shape {
	constructor(x, y, color, fontSize, fontFamily){
		console.log("creating text");
		super(x, y, color, fontSize, "Text", fontFamily);
		this.message = "";
	}

	draw(ctx){
		var fontInfo = this.fontSize + "px " + this.fontFamily;
		ctx.font = fontInfo;
		console.log(fontInfo);
		ctx.strokeText("Hello World!", this.x, this.y);
	}

	move(ctx, e){

	}

    drag(ctx, e){

    }

    setMessage(text){
    	this.message = text;
    }

}	
