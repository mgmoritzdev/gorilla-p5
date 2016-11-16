define(['collider'], function(Collider) {

	let CircularCollider = Object.create(Collider);

	CircularCollider.prototype.setDiameter = function(diameter) {
		this.diameter = diameter;
	};

	CircularCollider.prototype.collideCircularCircular = function(otherCollider) {
		return (this.position.dist(otherCollider.position) < this.diameter/2 - this.otherCollider.diameter/2);
	};

	return CircularCollider;
	
});
