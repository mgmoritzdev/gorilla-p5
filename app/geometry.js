define([], function () {

  const radians = function radians(degrees) {
    return degrees * (Math.PI / 180);
  };

  const degrees = function degrees(radians) {
    return radians * (180 / Math.PI);
  };

  const wrapAngle = function (angle) {

    if (isNaN(angle)) {
      throw new Error('The argument angle passed is not a number!');
    }

    if (angle >= 0 && angle < 360) {
      return angle;
    }

    return wrapAngle(angle >= 360 ? angle - 360 : angle + 360);
  };

  return {
    radians: radians,
    degrees: degrees,
    wrapAngle: wrapAngle
  };
});
