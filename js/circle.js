"use strict";
class Circle extends Shape {
	constructor(x, y, color, lineWidth){
		super(x, y, color, lineWidth, "Circle");
	}

	draw(ctx){
		var bounds = this.calcBounds();
		var x = (this.endX + this.x) / 2;
    	var y = (this.endY + this.y) / 2;
 
    	var radius = Math.max(
        	Math.abs(this.x - this.endX),
        	Math.abs(this.y - this.endY)) / 2;
 
    	ctx.beginPath();
    	ctx.arc(x, y, radius, 0, Math.PI*2, false);
    	ctx.stroke();
    	ctx.closePath();
	}

	move(ctx, e){
	    ctx.clearRect(0, 0, canvas.width, canvas.height);

		var x = (e.offsetX + this.x) / 2;
    	var y = (e.offsetY + this.y) / 2;
 
    	var radius = Math.max(
        	Math.abs(this.x - e.offsetX),
        	Math.abs(this.y - e.offsetY)) / 2;
 
    	ctx.beginPath();
    	ctx.arc(x, y, radius, 0, Math.PI*2, false);
    	ctx.stroke();
    	ctx.closePath();
	}
}	
