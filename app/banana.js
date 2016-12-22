define(['physics', 'circularCollider'], function (Physics, Collider) {

	var Banana = function(mass, gravity, size) {
		
		var banana = this;
		
		banana.name = 'banana';
		banana.isActive = false;
		
		banana.physics = new Physics();
		banana.physics.setName(banana.name);
		banana.physics.addRigidBody(mass, gravity);

		banana.size = size;
		
		var collider = new Collider();

		collider.setDiameter(size);
		collider.setName(banana.name);
		
		this.collider = collider;
		this.physics.addCollider(collider);

		this.physics.addCallbackToCollider(function(collision) {
			banana.isActive = false;
		});
  };

	Banana.prototype.update = function() {
		this.physics.update();
	};

	Banana.prototype.setRenderer = function(renderer) {
		this.renderer = renderer;
		this.collider.setRenderer(renderer);
	};
	
	Banana.prototype.render = function() {
		this.renderer.fill(0);
		this.renderer.ellipse(
			this.physics.position.x,
			this.physics.position.y,
			this.size,
			this.size);
	};

	Banana.prototype.onCollision = function(callback) {
		this.physics.addCallbackToCollider(callback);
	};
	
  return Banana;

});
