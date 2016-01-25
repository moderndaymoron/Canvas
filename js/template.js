"use strict";
class Template {
	constructor(shapes, name){
		this.shapes = shapes;
		this.name = name;
		this.maxX = 0;
		this.maxY = 0;
		this.minX = 0;
		this.minY = 0;
		setBounds();
	}

	setBounds(){
		var xArray = [];
		var yArray = [];

		for(var i = 0; i < this.shapes.length; i++){
			xArray.push(this.shapes[i].bounds.x);
			yArray.push(this.shapes[i].bounds.y);
			xArray.push(this.shapes[i].bounds.right);
			yArray.push(this.shapes[i].bounds.bottom);
		}

		this.maxX = Math.max(xArray);
		this.minX = Math.min(xArray);
		this.maxY = Math.max(yArray);
		this.minY = Math.min(yArray);
	}

	draw(ctx){
		for(var i = 0; i < this.shapes.length; i++){
			this.shapes[i].draw(ctx);
		}
	}

	drag(ctx, e){

	}
}