"use strict";
class Pen extends Shape {
	constructor(x, y, color, lineWidth){
		super(x, y, color, lineWidth, "Pen");
	}

	move(ctx, points){
		ctx.lineTo(points.x, points.y);
		ctx.stroke();
	}

}