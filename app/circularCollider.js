define(['collider'], function(Collider) {

	Collider.prototype.setDiameter = function(diameter) {
		this.diameter = diameter;
	};

	Collider.prototype.setRenderer = function(renderer) {
		this.renderer = renderer;
	};

	Collider.prototype.render = function() {

		if (!this.renderer) { return; }

		this.renderer.strokeWeight(2);
		this.renderer.stroke(0,0,0);
		this.renderer.fill(0,0,0,0);
		this.renderer.ellipse(this.position.x, this.position.y, this.diameter, this.diameter);
	};

	return Collider;
	
});
