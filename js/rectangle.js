"use strict";
class Rectangle extends Shape {
	constructor(x, y, color, lineWidth){
		super(x, y, color, lineWidth, "Rectangle");
	}

	draw(ctx){
		console.log("drawing rectangle");
		var bounds = this.calcBounds();
		ctx.strokeRect(this.x, this.y, bounds.maxX, bounds.maxY);
	}
}