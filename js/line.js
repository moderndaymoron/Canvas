"use strict";
class Line extends Shape {
	constructor(x, y, color, lineWidth){
		super(x, y, color, lineWidth, "Line");
	}

	draw(ctx){
		console.log("drawing line");
		var bounds = this.calcBounds();
		//ctx.beginPath();
		ctx.moveTo(this.x, this.y);
		ctx.lineTo(this.endX, this.endY);            
		ctx.stroke();
		//ctx.endPath();
	}
	move(ctx, e){
		ctx.clearRect(0, 0, canvas.width, canvas.height);
    	ctx.beginPath();
    	ctx.moveTo(this.x, this.y);
    	ctx.lineTo(e.offsetX, e.offsetY);
    	ctx.stroke();
    	ctx.closePath();
	}
}