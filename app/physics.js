define(['vector2'], function (Vector2) {
  var Physics = function(position, velocity) {
    this.position = position || new Vector2(0,0);
    this.velocity = velocity || new Vector2(0,0);
  };

  Physics.prototype.move = function (displacement) {
    this.position.addVector(displacement);
  };

  Physics.prototype.addRigidBody = function(mass, gravity) {
    this.mass = mass;
    this.gravity = gravity;
  };

  // TODO: implement colliders
  Physics.prototype.addCollider = function(collider) {
    if (typeof(this.colliders) === 'undefined') {
      this.colliders = [];
    }
    this.colliders.push(collider);
  };

  return Physics;
});
