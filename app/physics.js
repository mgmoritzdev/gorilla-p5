define(['vector2'], function (Vector2) {
  var Physics = function() {
    this.position = new Vector2(0,0);
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

  Physics.prototype.setForce = function (force) {
    if (typeof(this.mass) === 'undefined') {
      throw new Error('Cannot apply a force in an physical object without a defined mass');
    }

    if (typeof(this.acceleration) !== 'undefined') {
      throw new Error('Cannot apply a force because a fixed acceleration was previously set');  
    }

    this.force = force;
  };

  Physics.prototype.move = function (displacement) {
    this.position.addVector(displacement);
  };

  Physics.prototype.addRigidBody = function(mass, gravity) {
    this.mass = mass;
    this.gravity = gravity;
  };

  Physics.prototype.removeRigidBody = function() {
    this.mass = undefined;
    this.gravity = undefined;
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
  };

  return Physics;
});
