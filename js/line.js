"use strict";
class Line extends Shape {
	constructor(x, y, color, lineWidth){
		super(x, y, color, lineWidth, "Line");
	}

	draw(ctx){
		ctx.strokeStyle = this.color;
		ctx.lineWidth 	= this.lineWidth;
		this.isSelected(ctx);
		ctx.beginPath();
		ctx.moveTo(this.x, this.y);
		ctx.lineTo(this.endX, this.endY);            
		ctx.stroke();
		ctx.closePath();
	}

	move(ctx, e){
		ctx.strokeStyle = this.color;
		ctx.lineWidth 	= this.lineWidth;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
    	ctx.beginPath();
    	ctx.moveTo(this.x, this.y);
    	ctx.lineTo(e.offsetX, e.offsetY);
    	ctx.stroke();
    	ctx.closePath();
	}

	drag(ctx, e, x, y){
		var newX = e.offsetX - (e.offsetX-this.x);
		var newY = e.offsetY - (e.offsetY-this.y);
		
		if(e.offsetX > this.oldPoint.x){
			newX += e.offsetX - this.oldPoint.x;
		}
		else if(e.offsetX < this.oldPoint.x){
			newX -= Math.abs(this.oldPoint.x - e.offsetX);
		}
		if(e.offsetY > this.oldPoint.y){
			newY += e.offsetY - this.oldPoint.y;
		}
		else if(e.offsetY < this.oldPoint.y){
			newY -= Math.abs(this.oldPoint.y - e.offsetY);
		}

		this.setOldPoint(e.offsetX, e.offsetY);
		ctx.strokeStyle = this.color;
		ctx.lineWidth 	= this.lineWidth;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.beginPath();
		ctx.moveTo(newX, newY);
		ctx.lineTo(this.endX, this.endY);            
		ctx.stroke();
		ctx.closePath();
		this.x = newX;
		this.y = newY;
		this.setEnd(newX + this.bounds.width, newY + this.bounds.height);
	}
}