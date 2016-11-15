define(['physics', 'vector2'], function (Physics, Vector2) {
  var Banana = function(mass, gravity) {
    this.physics = new Physics();
	  this.physics.addRigidBody(mass, gravity);
  };

	Banana.prototype.update = function() {
		this.physics.update();
	};

  return Banana;
});
