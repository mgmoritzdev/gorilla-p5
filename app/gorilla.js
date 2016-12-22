define(['vector2', 'geometry', 'physics', 'circularCollider', 'baskara'], function (Vector2, geometry, Physics, Collider, baskara) {

	var cannonLength = 30;
	var gorillaDiameter = 40;
	
	var Gorilla = function(name, position, color, strength, angle, npc, mass, size, gravity) {

	  var gorilla = this;

	  gorilla.name = name;
	  gorilla.position = position;
	  gorilla.color = color;
	  gorilla.strength = strength;
	  gorilla.angle = angle;
	  gorilla.npc = npc || false;
	  gorilla.ai = {};
	  gorilla.physics = new Physics();
	  gorilla.physics.setPosition(gorilla.position);
	  gorilla.physics.addRigidBody(mass, gravity);
	  
	  var collider = new Collider();
	  gorilla.collider = collider;
	  
	  collider.setName(gorilla.name);
	  collider.setDiameter(size);
	  collider.setStatic(true);

	  gorilla.physics.addCollider(collider);
	  gorilla.physics.addCallbackToCollider(function(collision) {
		  gorilla.physics.removeCollider(collider);
	  });
  };

	Gorilla.prototype.setRenderer = function(renderer) {
		this.renderer = renderer;
		this.collider.setRenderer(renderer);
	};

	Gorilla.prototype.render = function() {
		var cannonEnd = this.getGorillaCannonTip();
	
		this.renderer.fill(this.color);
		this.renderer.noStroke();
		this.renderer.strokeWeight(0);
		this.renderer.ellipse(
			this.position.x,
			this.position.y,
			gorillaDiameter,
			gorillaDiameter
		);

		if (this.ai.target) {
			this.renderer.stroke(this.ai.target.color);
		} else {
			this.renderer.stroke(this.color);
		}

		this.renderer.strokeWeight(10);
		this.renderer.line(
			this.position.x,
			this.position.y,
			cannonEnd.x,
			cannonEnd.y);
		this.renderer.fill(255);
		this.renderer.strokeWeight(1);
		this.renderer.stroke(1);

		this.renderer.point(500, 200);

		// if (typeof(this.equation) === 'function') {
		// 	for (var i = 1; i < this.renderer.width; i++) {
		// 		this.renderer.line(
		// 			i-1, this.equation(i-1),
		// 			i, this.equation(i));
		// 	}
		// }
	};

	Gorilla.prototype.onCollision = function(callback) {
		this.physics.addCallbackToCollider(callback);
	};

	Gorilla.prototype.getGorillaCannonTip = function() {
		var color, strength, angle, position;
		color = this.color;
		strength = this.strength;
		angle = this.angle;
		position = this.position;

		return new Vector2(
			position.x + (cannonLength + strength) * Math.cos(geometry.radians(angle)),
			position.y + (cannonLength + strength) * -Math.sin(geometry.radians(angle))
		);
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

  Gorilla.prototype.selectTargetAI = function(gorillas) {
	  var targetIndex = Math.floor(Math.random() * (gorillas.length - 1));
	  var currentPlayerIndex = gorillas.indexOf(this);

    // discard itself
    if (targetIndex >= currentPlayerIndex) {
      targetIndex++;
    }

    this.ai.target = gorillas[targetIndex];
  };

	Gorilla.prototype.generateFirstGuessAI = function() {
		if (typeof(this.ai) === 'undefined' || typeof(this.ai.target) === 'undefined') { return; }

    var positionDiff = new Vector2(this.ai.target.position.x - this.position.x, this.ai.target.position.y - this.position.y);
		this.ai.angle = baskara.findAngleToShoot(this.position, this.ai.target.position);
		this.ai.strength = getFirstGuessStrength(this, positionDiff);
		//this.ai.strength =  baskara.findStrengthToShoot(this.position, this.ai.target.position, this.physics.gravity, this.ai.angle);
	};

	function getFirstGuessStrength(context, positionDiff) {
		var distance = context.ai.target.position.dist(context.position);
		return Math.pow(Math.abs(positionDiff.x), 0.5) / 2 +
		    (positionDiff.y < 0 ? Math.pow(Math.abs(positionDiff.y), 0.5) / 4 : 0);
	}

	function getFirstGuessAngle(positionDiff) {
		var angleBetweenThisAndTarget = Math.abs(geometry.degrees(Math.atan(Math.abs(positionDiff.y / positionDiff.x))));

		// starting from the angle between the line that connects this and target, got half way in the straigh angle direction
		var halfWayTowardsStraigthAngle = (90 - angleBetweenThisAndTarget) / 2;
		var angle = 0;

		if (positionDiff.x < 0) {
			if (positionDiff.y < 0) {
				angle = 90 + halfWayTowardsStraigthAngle;
			} else {
				angle = 90 + (90 + angleBetweenThisAndTarget) / 2;
			}
		} else {
			if (positionDiff.y < 0) {
				angle = angleBetweenThisAndTarget + halfWayTowardsStraigthAngle;
			} else {
				angle = 90 - (90 + angleBetweenThisAndTarget) / 2;
			}
		}

		return angle;
	}

	// TODO: no need to store results anymore
  Gorilla.prototype.storeResultAI = function() {
	  // if target exists store the distance, otherwhise the target has been destroyed

	  if (typeof(this.ai) !== 'undefined' && typeof(this.ai.throwResult) !== 'undefined') {

		  var A = this.getGorillaCannonTip();
		  var B = this.ai.vectors[Math.trunc(this.ai.vectors.length / 2)];
		  var C = this.ai.vectors[this.ai.vectors.length - 1];

		  this.eqIndexes = baskara.get2ndDegreeIndexes(A, B, C);
		  this.equation = baskara.getEquationFromPoints(A, B, C);
		  this.ai.aimDefined = false;
	  }

	  if (this.ai.target) {
      if (typeof(this.ai.previousThrowResult) !== 'undefined') {
	      this.ai.aimProgress =
		      getAverage(this.ai.previousThrowResult.sort().slice(0,3)) -
		      getAverage(this.ai.throwResult.sort().slice(0,3));
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


	  // This code will replace all the rest
	  if (typeof(this.equation) !== 'undefined') {
		  // get modified roots
		  // compare distance of roots with target
		  // decide what to do and assing new strenght, keep angle always the same.
		  var a, b, c;
		  a = this.eqIndexes.a;
		  b = this.eqIndexes.b;
		  c = this.eqIndexes.c;

		  var roots = baskara.findModifiedRoots(a, b, c, this.ai.target.position.y);
		  var currentDistanceFromThis = Math.max(
			  Math.abs(roots[0] - this.position.x),
			  Math.abs(roots[1] - this.position.x));

		  this.bananaDistance = (currentDistanceFromThis - Math.abs(this.ai.target.position.x - this.position.x));
		  var xDistanceBetweenThisAndTarget = Math.abs(this.ai.target.position.x - this.position.x);
		  if (currentDistanceFromThis > xDistanceBetweenThisAndTarget) {
			  // reduceStrength
			  this.setStrategy(strengthOffset, angleOffset, -1, 0);
		  } else {
			  // increase strength
			  this.setStrategy(strengthOffset, angleOffset, 1, 0);
		  }
	  }

	  if (typeof(this.ai.aimStrategy) === 'undefined'){		  
		  this.setStrategy(strengthOffset, angleOffset, 1, 0);
	  }
		  
	  // WARNING: Early return, all above is unrecheable code!
	  return;

	  if (!this.isStrategySet()) {
      this.setStrategy(strengthOffset, angleOffset, 0, 1);
      return;
    }

    // aim diverging
    if (this.ai.aimProgress <= 0) {
      this.setNextStrategy(strengthOffset, angleOffset);
    }
  };

  Gorilla.prototype.isStrategySet = function() {
    return typeof(this.ai.aimStrategy) !== 'undefined';
  };

  Gorilla.prototype.setNextStrategy = function(strengthOffset, angleOffset) {
    var strategies = [-1, 0, 1];
    var currStrength = this.getDirection(this.ai.aimStrategy.strength);
    var currAngle = this.getDirection(this.ai.aimStrategy.angle);

    if (currAngle === 1) {
      if (currStrength === 1) {
        this.setStrategy(strengthOffset, angleOffset, -1, -1);
      }
      else {
        this.setStrategy(strengthOffset, angleOffset, currStrength + 1, -1);
      }
    } else {
      this.setStrategy(strengthOffset, angleOffset, currStrength, currAngle + 1);
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
		var bananaDistanceX = this.bananaDistance || 1;

		var bananaDistanceY = 1;
		if (this.equation) {			
			bananaDistanceY = Math.abs(this.equation(this.ai.target.position.x) - this.ai.target.position.y) || 1;
		}
		
		var distanceFactor = Math.pow(bananaDistanceX * bananaDistanceX +
		                              bananaDistanceY * bananaDistanceY, .5) / 400;
		
		
    this.ai.aimStrategy = {
      strength: strengthOffset * strengthStrategy * 15 * distanceFactor,
      angle: angleOffset * angleStrategy * 15
    };
  };

	Gorilla.prototype.updateAimAI = function(strengthOffset, angleOffset) {
		if (typeof(this.ai.aimStrategy) === 'undefined') {
			this.setAimStrategyAI(strengthOffset, angleOffset);
		}
		
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

	Gorilla.prototype.updateTargetAI = function(gorillas, strengthOffset, angleOffset) {
		if (gorillas.indexOf(this.ai.target) === -1) {
			this.selectTargetAI(gorillas);
			this.generateFirstGuessAI();
		} else if (!this.aimDefined()) {
			this.setAimStrategyAI(strengthOffset, angleOffset);
			this.updateAimAI(strengthOffset, angleOffset);
		}
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
