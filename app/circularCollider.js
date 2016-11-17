define(['collider'], function(Collider) {

	Collider.prototype.setDiameter = function(diameter) {
		this.diameter = diameter;
	};

	Collider.prototype.collideCircularCircular = function(otherCollider) {
		return (this.position.dist(otherCollider.position) < this.diameter/2 - this.otherCollider.diameter/2);
	};

	return Collider;
	
});
