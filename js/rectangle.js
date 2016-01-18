"use strict";
class Rectangle extends Shape {
	constructor(x, y, color, lineWidth){
		super(x, y, color, lineWidth, "Rectangle");
	}

	draw(x, y, ctx){
		var bounds = this.calcBounds();
		ctx.strokeRect(bounds.x, bounds.y, bounds.maxX, bounds.maxY);
	}
}