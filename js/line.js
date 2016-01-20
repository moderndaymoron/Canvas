"use strict";
class Line extends Shape {
	constructor(x, y, color, lineWidth){
		super(x, y, color, lineWidth, "Line");
	}

	draw(ctx){
		console.log("drawing line");
		var bounds = this.calcBounds();
		ctx.moveTo(this.x, this.y);
		ctx.lineTo(this.endX, this.endY);            
		ctx.stroke();
	}
}