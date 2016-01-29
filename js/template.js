"use strict";
class Template {
	constructor(shap, name){
		var shapes = shap.slice();
		console.log(shapes);
		this.name = name;
		this.maxX = 0;
		this.maxY = 0;
		this.minX = 0;
		this.minY = 0;
		this.setBounds();
	}

	setBounds(){
		var xArray = [];
		var yArray = [];

		for(var i = 0; i < shapes.length; i++){
			xArray.push(shapes[i].bounds.x);
			yArray.push(shapes[i].bounds.y);
			xArray.push(shapes[i].bounds.right);
			yArray.push(shapes[i].bounds.bottom);
		}

		this.maxX = Math.max.apply(Math, xArray);
		this.minX = Math.min.apply(Math, xArray);
		this.maxY = Math.max.apply(Math, yArray);
		this.minY = Math.min.apply(Math, yArray);
	}

	draw(ctx){
		for(var i = 0; i < shapes.length; i++){
			console.log(shapes[i]);
			shapes[i].draw(ctx);
		}
	}

	drag(ctx, e){

	}
}