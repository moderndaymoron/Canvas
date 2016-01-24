"use strict";
class Pen extends Shape {
	constructor(x, y, color, lineWidth){
		super(x, y, color, lineWidth, "Pen");
		this.penPoints = [];
	}

	draw(ctx){
		ctx.strokeStyle = this.color;
		ctx.lineWidth = this.lineWidth;
		if (this.penPoints.length < 3) {
			var b = this.penPoints[0];
			ctx.beginPath();
			ctx.arc(b.x, b.y, ctx.lineWidth / 2, 0, Math.PI * 2, !0);
			ctx.fill();
			ctx.closePath();
			
			return;
		}
		ctx.beginPath();
		ctx.moveTo(this.penPoints[0].x, this.penPoints[0].y);
		
		for (var i = 1; i < this.penPoints.length - 2; i++) {
			var c = (this.penPoints[i].x + this.penPoints[i + 1].x) / 2;
			var d = (this.penPoints[i].y + this.penPoints[i + 1].y) / 2;
			
			ctx.quadraticCurveTo(this.penPoints[i].x, this.penPoints[i].y, c, d);
		}
		
		ctx.quadraticCurveTo(this.penPoints[i].x, this.penPoints[i].y, 
			this.penPoints[i + 1].x, this.penPoints[i + 1].y);
		ctx.stroke();
	}

	move(ctx, e){
		this.penPoints.push({x: e.offsetX, y: e.offsetY});
		if (this.penPoints.length < 3) {
			var b = this.penPoints[0];
			ctx.beginPath();
			ctx.arc(b.x, b.y, ctx.lineWidth / 2, 0, Math.PI * 2, !0);
			ctx.fill();
			ctx.closePath();
			
			return;
		}
		
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.beginPath();
		ctx.moveTo(this.penPoints[0].x, this.penPoints[0].y);
		
		for (var i = 1; i < this.penPoints.length - 2; i++) {
			var c = (this.penPoints[i].x + this.penPoints[i + 1].x) / 2;
			var d = (this.penPoints[i].y + this.penPoints[i + 1].y) / 2;
			
			ctx.quadraticCurveTo(this.penPoints[i].x, this.penPoints[i].y, c, d);
		}
		
		ctx.quadraticCurveTo(this.penPoints[i].x, this.penPoints[i].y, this.penPoints[i + 1].x, this.penPoints[i + 1].y);
		ctx.stroke();
	}

	setInitialCoords(){
		this.penPoints.push({x: this.x, y: this.y});
	}

	drag(ctx, e, x, y){
		//TODO
	}
}