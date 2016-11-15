define([], function () {
  var Vector2 = function(x, y) {
    this.x = x;
    this.y = y;
  };

  Vector2.prototype.copy = function() {
    return new Vector2(this.x, this.y);
  };

  Vector2.prototype.addVector = function (otherVector) {
    this.x += otherVector.x;
    this.y += otherVector.y;
  };

	Vector2.prototype.multiplyConst = function(c) {
		this.x *= c;
		this.y *= c;
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
