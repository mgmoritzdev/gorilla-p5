define(['vector2', 'collisionManager'], function (Vector2, cm) {
  var Physics = function() {
	  this.position = new Vector2(0, 0);
    this.velocity = new Vector2(0, 0);
    this.rotation = 0;
  };

  Physics.prototype.setPosition = function (position) {
    this.position.x = position.x;
	  this.position.y = position.y;
  };

  Physics.prototype.setVelocity = function (velocity) {
	  this.velocity.x = velocity.x;
	  this.velocity.y = velocity.y;
  };

  Physics.prototype.setRotation = function (rotation) {
    this.rotation = rotation;
  };

	Physics.prototype.setName = function(name) {
		this.name = name;
	};
	
  Physics.prototype.setAcceleration = function (acceleration) {
    this.fixedAcceleration = acceleration.copy();
	  this.acceleration = acceleration;
  };

  Physics.prototype.removeAcceleration = function () {
    this.fixedAcceleration = undefined;
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

	  cm.addCollider(collider);
	  
    if (typeof(this.colliders) === 'undefined') {
      this.colliders = [];
    }
	  collider.setPosition(this.position);
    this.colliders.push(collider);
  };

  Physics.prototype.removeCollider = function(collider) {

	  cm.removeCollider(collider);
	  
	  if (typeof(this.colliders) === 'undefined') {
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

		this.acceleration = new Vector2();
		
		if (typeof(this.forces) === 'undefined') {
			return;
		}
		
		if (typeof(this.fixedAcceleration) !== 'undefined') {
			this.acceleration.addVector(this.fixedAcceleration);
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
