define([], function () {

  const radians = function radians(degrees) {
    return degrees * (Math.PI / 180);
  };

  const degrees = function degrees(radians) {
    return radians * (180 / Math.PI);
  };

  const wrapAngle = function (angle) {
    if (angle > 360) {
      angle -= 360;
    } else if (angle < 0) {
      angle += 360;
    }

    return angle;
  };

  return {
    radians: radians,
    degrees: degrees,
    wrapAngle: wrapAngle
  };
});
