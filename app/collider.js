define(['vector2'], function(Vector2) {

	var Collider = function() {
		this.collidersToCheck = [];
	};

	Collider.prototype.setPosition = function(position) {
		
		if (!(position instanceof Vector2) && (typeof(position) !== 'undefined')) {
			throw new Error("Invalid value for collider position. Should be instance of Vector2");
		}
		
		this.position = position || new Vector2();

	};
	
	Collider.prototype.addColliderToCheck = function(collider) {
		if (!(collider instanceof Collider)) {
			throw new Error("Cannot add an object other than collider to the list of colliders to check agains");
		}
		this.collidersToCheck.push(collider);
	};

	Collider.prototype.removeColliderToCheck = function(collider) {
		if (typeof(this.collidersToCheck) === 'undefined') {
			return;
		}

		const index = this.collidersToCheck.indexOf(collider);

		if (index > -1) {
			this.collidersToCheck.splice(index, 1);
		}

	};
	
	return Collider;

});
