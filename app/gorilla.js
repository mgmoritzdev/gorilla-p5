define(['vector2', 'geometry'], function (Vector2, geometry) {

  var Gorilla = function(name, position, color, strength, angle, npc) {
    this.name = name;
    this.position = position;
    this.color = color;
    this.strength = strength;
    this.angle = angle;

    this.npc = npc || false;
    this.ai = {};

    this.angleDirection = this.npc ? 1 : 1;
  };

  /* AI Functions
  * new gorilla attributes:
  * - target: Gorilla
  * - throwResult
  * - previousThrowResult
  * - aimProgress
  * - aimStrategy
  *     .angle
  *     .strength
  */

  Gorilla.prototype.selectTargetAI = function(gorillas, currentPlayerIndex) {
    var targetIndex = Math.floor(Math.random() * (gorillas.length - 1));

    // discard itself
    if (targetIndex >= currentPlayerIndex) {
      targetIndex++;
    }

    this.ai.target = gorillas[targetIndex];
  };

  Gorilla.prototype.generateFirstGuessAI = function() {
    var positionDiff = new Vector2(this.ai.target.position.x - this.position.x, this.ai.target.position.y - this.position.y);
    var distance = this.ai.target.position.dist(this.position);
    this.ai.strength = Math.pow(Math.abs(positionDiff.x), 0.5) / 2 +
      (positionDiff.y < 0 ? Math.pow(Math.abs(positionDiff.y), 0.5) / 4 : 0);

    var angleBetweenThisAndTarget = Math.abs(geometry.degrees(Math.atan(Math.abs(positionDiff.y / positionDiff.x))));

    // starting from the angle between the line that connects this and target, got half way in the straigh angle direction
    var halfWayTowardsStraigthAngle = (90 - angleBetweenThisAndTarget) / 2;

    if (positionDiff.x < 0) {
      if (positionDiff.y < 0) {
        this.ai.angle = 90 + halfWayTowardsStraigthAngle;
      } else {
        this.ai.angle = 90 + (90 + angleBetweenThisAndTarget) / 2;
      }
    } else {
      if (positionDiff.y < 0) {
        // ok
        this.ai.angle = angleBetweenThisAndTarget + halfWayTowardsStraigthAngle;
      } else {
        // ok
        this.ai.angle = 90 - (90 + angleBetweenThisAndTarget) / 2;
      }
    }
  };

  // need improvements, would be better if I could know which side of target was the thrown
  Gorilla.prototype.storeResultAI = function() {
    // if target exists store the distance, otherwhise the target has been destroyed
    if (this.ai.target) {
      if (typeof(this.ai.previousThrowResult) !== 'undefined') {
        this.ai.aimProgress = getAverage(this.ai.previousThrowResult.sort().slice(0,3)) - getAverage(this.ai.throwResult.sort().slice(0,3));
      }
      this.ai.previousThrowResult = this.ai.throwResult;
      this.ai.throwResult = undefined;
      this.ai.aimDefined = false;
    } else {
      this.ai.throwResult = undefined;
      this.ai.previousThrowResult = undefined;
      this.ai.aimDefined = false;
    }
  };

  function getAverage(array) {
    var sum = array.reduce(function(a, b) { return a + b; });
    return sum / array.length;
  }

  /* Consider two strategies that can be combined: angle strategy and strength strategy */
  // all combinations of strength and angle are possible:
  // strength: [-1, 0, 1] * strength
  // angle: [-1, 0, 1] * angle
  Gorilla.prototype.setAimStrategyAI = function(strengthOffset, angleOffset) {
    var randomOffsetFactor = Math.floor(Math.random() * 16 + 5);

    if (!this.isStrategySet()) {
      this.setStrategy(strengthOffset, angleOffset, 0, 1);
      return;
    }

    // aim diverging
    if (this.ai.aimProgress <= 0) {
      this.setNextStrategy();
    }
  };

  Gorilla.prototype.isStrategySet = function() {
    return typeof(this.ai.aimStrategy) !== 'undefined';
  };

  Gorilla.prototype.setNextStrategy = function() {
    var strategies = [-1, 0, 1];
    var currStrength = this.getDirection(this.ai.aimStrategy.strength);
    var currAngle = this.getDirection(this.ai.aimStrategy.angle);

    if (currAngle === 1) {
      if (currStrength === 1) {
        this.setStrategy(-1, -1);
      }
      else {
        this.setStrategy(currStrength + 1, -1);
      }
    } else {
      this.setStrategy(currStrength, currAngle + 1);
    }
  };

  Gorilla.prototype.getDirection = function(value) {
    if (value > 0) {
      return 1;
    } else if (value < 0) {
      return -1;
    } else {
      return 0;
    }
  };

  Gorilla.prototype.setStrategy = function(strengthOffset, angleOffset, strengthStrategy, angleStrategy) {
    this.ai.aimStrategy = {
      strength: strengthOffset * strengthStrategy * 10,
      angle: angleOffset * angleStrategy * 10
    };
  };

  Gorilla.prototype.updateAimAI = function() {
    this.ai.angle = geometry.wrapAngle(this.ai.angle + this.ai.aimStrategy.angle);
    this.ai.strength = wrapStrength(this.ai.strength + this.ai.aimStrategy.strength);
    this.ai.aimDefined = true;
  };

  Gorilla.prototype.aimDefined = function() {
    return this.ai.aimDefined;
  };

  Gorilla.prototype.getAngleAxis = function(sensitivity) {
    var angleAxis = this.ai.angle - this.angle;
    return getAxis(angleAxis, sensitivity);
  };

  Gorilla.prototype.getStrengthAxis = function(sensitivity) {
    var strengthAxis = this.ai.strength - this.strength;
    return getAxis(strengthAxis, sensitivity);
  };

  Gorilla.prototype.addStrength = function (amount) {
    this.strength = wrapStrength(this.strength + amount);
  };

  Gorilla.prototype.addAngle = function (amount) {
    this.angle = geometry.wrapAngle(this.angle + amount);
  };

  function getAxis(axis, sensitivity) {
    if (axis > sensitivity) {
      return 1;
    } else if (axis < -sensitivity) {
      return -1;
    } else {
      return 0;
    }
  }

  function wrapAngle(angle) {
    if (angle > 360) {
      angle -= 360;
    } else if (angle < 0) {
      angle += 360;
    }

    return angle;
  }

  function wrapStrength(strength) {
    if (strength > 20) {
      strength = 20;
    } else if (strength < 0) {
      strength = 0;
    }

    return strength;
  }

  return Gorilla;
});