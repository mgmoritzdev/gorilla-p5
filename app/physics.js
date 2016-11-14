define(['vector2'], function (Vector2) {
  var Physics = function(position, rotation) {
    this.position = position || new Vector2(0,0);
    this.rotation = rotation || 0;
  };

  Physics.prototype.setPosition = function (position) {
    this.position = position;
  };

  Physics.prototype.setRotation = function (rotation) {
    this.rotation = rotation;
  };

  Physics.prototype.move = function (displacement) {
    this.position.addVector(displacement);
  };

  Physics.prototype.addRigidBody = function(mass, gravity) {
    this.mass = mass;
    this.gravity = gravity;
  };

  Physics.prototype.addCollider = function(collider) {
    if (typeof(this.colliders) === 'undefined') {
      this.colliders = [];
    }
    this.colliders.push(collider);
  };

  return Physics;
});
