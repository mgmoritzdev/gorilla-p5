define(['physics', 'circularCollider'], function (Physics, Collider) {

	var Banana = function(mass, gravity, size) {
		
		let banana = this;
		
		banana.name = 'banana';
		
		banana.physics = new Physics();
		banana.physics.setName(banana.name);
		banana.physics.addRigidBody(mass, gravity);
		
		banana.size = size;
		banana.destroy = false;
		
		
		const collider = new Collider();

		collider.setDiameter(size);
		collider.setName(banana.name);
		
		collider.onCollision = function(collision) {
			this.destroy = true;
			banana.physics.removeCollider(collider);
		};

		this.collider = collider;
		this.physics.addCollider(collider);
  };

	Banana.prototype.update = function() {
		this.physics.update();
	};

	Banana.prototype.render = function(renderer) {
		renderer.fill(0);
		renderer.ellipse(
			this.physics.position.x,
			this.physics.position.y,
			this.size,
			this.size);
	};

	Banana.prototype.onCollision = function() {
		this.collider.onCollision();
	};
	
  return Banana;

});
