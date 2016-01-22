"use strict";
class Rectangle extends Shape {
	constructor(x, y, color, lineWidth){
		super(x, y, color, lineWidth, "Rectangle");
	}

	draw(ctx){
		var bounds = this.calcBounds();
		if(this.selected){
			ctx.strokeStyle = "violet";
			ctx.strokeRect(bounds.x, bounds.y, bounds.maxX, bounds.maxY);
		}else{
			ctx.strokeStyle = this.color;
			ctx.strokeRect(bounds.x, bounds.y, bounds.maxX, bounds.maxY);
		}
	}

	move(ctx, e){
		var x = Math.min(e.offsetX, this.x);
		var y = Math.min(e.offsetY, this.y);
		var width = Math.abs(e.offsetX - this.x);
		var height = Math.abs(e.offsetY - this.y);
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.strokeRect(x, y, width, height);
	}

	drag(ctx, e){
		var bounds = this.calcBounds();
		var newX = e.offsetX - this.x;
		var newY = e.offsetY - this.y;
		console.log(e.offsetX, e.offsetY, bounds);
		ctx.strokeRect(newX, newY, Math.abs(this.endX-this.x), Math.abs(this.endY-this.y));

	}

}