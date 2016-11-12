define(['physics', 'vector2'], function (Physics, Vector2) {
  var Banana = function(position, velocity, size) {
    this.position = position;
    this.velocity = velocity;
    this.size = size;
  };

  return Banana;
});
