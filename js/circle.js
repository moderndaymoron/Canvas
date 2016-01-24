"use strict";
class Circle extends Shape {
	constructor(x, y, color, lineWidth){
		super(x, y, color, lineWidth, "Circle");
	}

	draw(ctx){
		var x = (this.endX + this.x) / 2;
    	var y = (this.endY + this.y) / 2;
    	var radius = Math.max(Math.abs(this.x - this.endX), Math.abs(this.y - this.endY)) / 2;
        
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.lineWidth; 
    	ctx.beginPath();
    	ctx.arc(x, y, radius, 0, Math.PI*2, false);
    	ctx.stroke();
    	ctx.closePath();
	}

	move(ctx, e){
		var x = (e.offsetX + this.x) / 2;
    	var y = (e.offsetY + this.y) / 2;
    	var radius = Math.max(Math.abs(this.x - e.offsetX), Math.abs(this.y - e.offsetY)) / 2;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    	ctx.beginPath();
    	ctx.arc(x, y, radius, 0, Math.PI*2, false);
    	ctx.stroke();
    	ctx.closePath();
	}

    drag(ctx, e, x, y){
        //needs fixing!
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

        var x = (this.endX + this.x) / 2;
        var y = (this.endY + this.y) / 2;
        var radius = Math.max(Math.abs(this.x - this.endX), Math.abs(this.y - this.endY)) / 2;
        
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI*2, false);
        ctx.stroke();
        ctx.closePath();
        this.x = newX;
        this.y = newY;
        this.setEnd(newX + this.bounds.width, newY + this.bounds.height);
    }
}	
