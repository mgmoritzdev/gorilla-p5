define([], function () {
  var Vector2 = function(x, y) {
    this.x = x;
    this.y = y;
  };

  Vector2.prototype.dist = function(otherVector) {
    return Math.pow(
      Math.pow(this.x - otherVector.x, 2) +
        Math.pow(this.y - otherVector.y,2),
      0.5);
  };

  Vector2.prototype.sqDist = function(otherVector) {
    return Math.pow(this.x - otherVector.x, 2) +
        Math.pow(this.y - otherVector.y,2);
  };

  return Vector2;
});
