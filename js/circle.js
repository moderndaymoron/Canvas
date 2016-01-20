"use strict";
class Circle extends Shape {
	constructor(x, y, color, lineWidth){
		super(x, y, color, lineWidth, "Circle");
	}

	draw(ctx){
		var bounds = this.calcBounds();
		ctx.strokeRect(bounds.x, bounds.y, bounds.maxX, bounds.maxY);
	}
}