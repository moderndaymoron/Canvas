"use strict";
class Circle extends Shape {
	constructor(x, y, color, lineWidth, radius){
		super(x, y, color, lineWidth, "Circle");
        this.radius = 0;
	}

	draw(ctx){
		ctx.strokeStyle = this.color;
        ctx.lineWidth   = this.lineWidth;
        this.isSelected(ctx); 
    	ctx.beginPath();
    	ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
    	ctx.stroke();
    	ctx.closePath();
	}

	move(ctx, e, points){
		var newX      = (e.offsetX + points.x) / 2;
    	var newY      = (e.offsetY + points.y) / 2;
    	this.radius   = Math.max(Math.abs(e.offsetX - points.x), Math.abs(e.offsetY - points.y)) / 2;

        ctx.strokeStyle = this.color;
        ctx.lineWidth   = this.lineWidth; 
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    	ctx.beginPath();
    	ctx.arc(newX, newY, this.radius, 0, Math.PI*2, false);
    	ctx.stroke();
    	ctx.closePath();
        this.x = newX;
        this.y = newY;
    }

    drag(ctx, e){
        var newX   = e.offsetX - canvas.offsetLeft;
        var newY   = e.offsetY - canvas.offsetTop;
        if(this.isOutOfBounds(newX - this.radius, newX + this.radius, newY - this.radius, newY + this.radius)){
            return;
        }

        ctx.strokeStyle = this.color;
        ctx.lineWidth   = this.lineWidth; 
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.arc(newX, newY, this.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.closePath();
        this.x = newX;
        this.y = newY;
        this.setEnd(newX + this.bounds.width, newY + this.bounds.height);
    }

    loadValues(shape){
        this.color     = shape.color;
        this.lineWidth = shape.lineWidth;
        this.radius    = shape.radius;
        this.x         = shape.x;
        this.y         = shape.y;
        this.endX      = shape.endX;
        this.endY      = shape.endY;
        this.bounds    = shape.bounds;

    }
}	
