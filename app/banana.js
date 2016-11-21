define(['physics', 'circularCollider'], function (Physics, Collider) {

	var Banana = function(mass, gravity, size) {
    this.physics = new Physics();
	  this.physics.addRigidBody(mass, gravity);
		this.size = size;
		this.destroy = false;
			
		const collider = new Collider();
		collider.setDiameter(size);
		collider.onCollision = function(collision) {
			this.destroy = true;
			console.log('banana collided');
		};
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

  return Banana;

});
