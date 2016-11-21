define(['vector2'], function(Vector2) {

	var Collider = function() {
		this.static = false;
	};

	Collider.prototype.setPosition = function(position) {
		
		if (!(position instanceof Vector2) && (typeof(position) !== 'undefined')) {
			throw new Error("Invalid value for collider position. Should be instance of Vector2");
		}
		
		this.position = position || new Vector2();

	};

	Collider.prototype.setType = function(type) {
		this.type = type;
	};

	Collider.prototype.setStatic = function(isStatic) {
		this.static = isStatic;
	};
	
	return Collider;

});
