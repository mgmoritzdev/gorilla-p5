define(['vector2'], function (Vector2) {
  var Physics = function() {
	  this.position = new Vector2(0, 0);
    this.velocity = new Vector2(0, 0);
    this.rotation = 0;
  };

  Physics.prototype.setPosition = function (position) {
    this.position = position;
  };

  Physics.prototype.setVelocity = function (velocity) {
    this.velocity = velocity;
  };

  Physics.prototype.setRotation = function (rotation) {
    this.rotation = rotation;
  };

  Physics.prototype.setAcceleration = function (acceleration) {
    this.acceleration = acceleration;
  };

  Physics.prototype.removeAcceleration = function () {
    this.acceleration = undefined;
  };

  Physics.prototype.addForce = function (force) {

    if (!(force instanceof Vector2)) {
      throw new Error('The force vector must be of Vector2 type');
    }
	  
	  if (typeof(this.forces) === 'undefined') {
		  this.forces = [];
	  }
	  
	  this.forces.push(force);
	  
  };

	Physics.prototype.removeForce = function(force) {
		
		if (typeof(this.forces) === 'undefined') {
			// nothing to do here
			return;
		}

		const index = this.forces.indexOf(force);

		if (index > -1) {
			this.forces.splice(index, 1);
		}
		
	};

  Physics.prototype.move = function (displacement) {
    this.position.addVector(displacement);
  };

  Physics.prototype.addRigidBody = function(mass, gravity) {
	  
	  this.mass = mass;
	  this.gravity = gravity;
	  
	  // keeps a reference to gravity force so it can remove it later
	  this.gravityForce = new Vector2(0, mass * gravity);
	  this.addForce(this.gravityForce);
  };

  Physics.prototype.removeRigidBody = function() {
    this.mass = undefined;
    this.gravity = undefined;
	  this.removeForce(this.gravityForce);
  };  

  Physics.prototype.addCollider = function(collider) {
    if (typeof(this.colliders) === 'undefined') {
      this.colliders = [];
    }
    this.colliders.push(collider);
  };

  Physics.prototype.removeCollider = function(collider) {
    if (typeof(this.colliders) === 'undefined') {
      // nothing to do here
      return;
    }

    const index = this.colliders.indexOf(collider);

    if (index > -1) {
      this.colliders.splice(index, 1);
    }
    
  };

  Physics.prototype.update = function() {
	  
    this.position.addVector(this.velocity);
	  this.updateVelocity();
	  this.updateAccelerationDueForces();
	  
  };

	Physics.prototype.updateAccelerationDueForces = function() {

		if (typeof(this.forces) === 'undefined') {
			return;
		}
		
		if (typeof(this.acceleration) === 'undefined') {
			this.acceleration = new Vector2(0, 0);
		}
				
		for(var i = 0; i < this.forces.length; i++) {
			const acc = this.forces[i].copy();
			acc.multiplyConst(1/this.mass);
			this.acceleration.addVector(acc);
		}
	};

	Physics.prototype.updateVelocity = function() {
		if (typeof(this.acceleration) !== 'undefined')
			this.velocity.addVector(this.acceleration);
	};

  return Physics;
});
