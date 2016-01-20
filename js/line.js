"use strict";
class Line extends Shape {
	constructor(x, y, color, lineWidth){
		super(x, y, color, lineWidth, "Line");
	}

	draw(ctx){
		console.log("drawing line");
		var bounds = this.calcBounds();
		ctx.strokeLine(this.x, this.y, bounds.maxX, bounds.maxY);
	}
}