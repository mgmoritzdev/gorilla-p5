define([], function () {
  var Vector2 = function(x, y) {
    this.x = x || 0;
    this.y = y || 0;
  };

  Vector2.prototype.copy = function() {
    return new Vector2(this.x, this.y);
  };

  Vector2.prototype.addVector = function (otherVector) {
    this.x += otherVector.x;
    this.y += otherVector.y;
  };

	Vector2.prototype.subtractVector = function(otherVector) {
		const auxVec = otherVector.copy();
		auxVec.multiplyConst(-1);
		this.addVector(auxVec);
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

	Vector2.prototype.magnitude = function() {
		return this.dist(new Vector2());
	};
	
  return Vector2;
});
