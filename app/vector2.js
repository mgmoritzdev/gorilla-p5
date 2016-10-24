define([], function () {
  var Vector2 = function(x, y) {
    this.x = x;
    this.y = y;
  };

  Vector2.prototype.dist = function(otherVector) {
    return Math.pow(
      Math.pow(
        Math.abs(this.x - otherVector.x), 2) +
        Math.pow(Math.abs(this.y - otherVector.y),2),
      0.5);
  };

  return Vector2;
});
