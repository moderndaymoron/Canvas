"use strict";
class Rectangle extends Shape {
	constructor(x, y, color, lineWidth){
		super(x, y, color, lineWidth, "Rectangle");
	}

	draw(ctx){
		var bounds = this.calcBounds();
		if(this.selected){
			this.color = "red";
			this.lineWidth = 4;
		}
		ctx.strokeStyle = this.color;
		ctx.strokeRect(bounds.x, bounds.y, bounds.maxX, bounds.maxY);
	}

	move(ctx, e){
		var x = Math.min(e.offsetX, this.x);
		var y = Math.min(e.offsetY, this.y);
		var width = Math.abs(e.offsetX - this.x);
		var height = Math.abs(e.offsetY - this.y);
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.strokeRect(x, y, width, height);
	}
}