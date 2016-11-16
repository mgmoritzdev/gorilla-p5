define(['physics'], function (Physics) {

	var Banana = function(mass, gravity, size) {
    this.physics = new Physics();
	  this.physics.addRigidBody(mass, gravity);
		this.size = size;
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
