"use strict";
class Rectangle extends Shape {
	constructor(x, y, color, lineWidth){
		super(x, y, color, lineWidth, "Rectangle");
	}

	draw(ctx){
		ctx.lineWidth = this.lineWidth;
		if(this.selected){
			ctx.strokeStyle = "orange";
		}
		else{
			ctx.strokeStyle = this.color;
		}
		
		ctx.strokeRect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);

	}

	move(ctx, e){
		var x = Math.min(e.offsetX, this.x);
		var y = Math.min(e.offsetY, this.y);
		var width = Math.abs(e.offsetX - this.x);
		var height = Math.abs(e.offsetY - this.y);
		ctx.strokeStyle = this.color;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.strokeRect(x, y, width, height);
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
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.strokeStyle = this.color;
		ctx.strokeRect(newX, newY, this.bounds.width, this.bounds.height);
		this.x = newX;
		this.y = newY;
		this.setEnd(newX + this.bounds.width, newY + this.bounds.height);
	}
}