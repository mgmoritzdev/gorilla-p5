define(['vector2', 'geometry'], function (Vector2, geometry) {

	// Bàskara equation: f(x) = a*x²+b*x+c
	
	const findRoots = function (a, b, c) {		
		var roots = [];
		var delta = calculateDelta(a, b, c);		

		if (delta == 0) {
			roots.push(-b / (2 * a));
		} else {

			var sqrtOfDelta = Math.sqrt(delta);
			
			roots.push((-b + sqrtOfDelta) / (2 * a));
			roots.push((-b - sqrtOfDelta) / (2 * a));
		}
		
		return roots;
	};

	const calculateDelta = function(a, b, c) {
		return b*b - 4 * a * c;	
	};

	function findAngleToShoot(A, B) {
		
		var positionDiff = new Vector2(B.x - A.x, B.y - A.y);
		var angleAB = Math.abs(geometry.degrees(Math.atan(Math.abs(positionDiff.y / positionDiff.x))));

		// starting from the angle between the line that connects this and target, got half way in the straigh angle direction
		var angleHalfwayTo90 = (90 - angleAB) / 2;
		var angle = 0;
		
		if (positionDiff.x < 0) {
			if (positionDiff.y < 0) {
				angle = 90 + angleHalfwayTo90;
			} else {
				angle = 90 + (90 + angleAB) / 2;
			}
		} else {
			if (positionDiff.y < 0) {
				angle = angleAB + angleHalfwayTo90;
			} else {
				angle = 90 - (90 + angleAB) / 2;
			}
		}

		return angle;
	}

	function findStrengthToShoot(A, B, gravity, angle) {

		var a = -1;
		var b = getB(angle);
		var c = getC(B.x - A.x, angle);

		if (typeof(angle) === 'undefined') {
			angle = findAngleToShoot(A, B);
		}

		// TODO: this is buggy
		const arbitraryConstant = 0.000005;
		const vx = arbitraryConstant * gravity * (-b*b/(2*a) + c);
		const tanAngle = Math.tan(geometry.radians(angle));
		const strength = Math.abs(vx * Math.sqrt(1 + tanAngle * tanAngle));

		return strength;
	};
	
	function getB(angle) {
		return Math.tan(geometry.radians(angle));
	}

	function getC(Bx, angle) {
		return (-Bx * Bx - getB(angle) * Bx);
	}

	// Solve using Cramer's Law
	function get2ndDegreeIndexes(A, B, C) {
		
		const a =
		      A.y * B.x +
		      A.x * C.y +
		      C.x * B.y -
		      C.y * B.x -
		      C.x * A.y -
		      B.y * A.x;

		const b =
		      A.x * A.x * B.y +
		      C.x * C.x * A.y +
		      B.x * B.x * C.y -
		      C.x * C.x * B.y -
		      A.x * A.x * C.y -
		      B.x * B.x * A.y;

		const c =
		      A.x * A.x * B.x * C.y +
		      C.x * C.x * A.x * B.y +
		      B.x * B.x * C.x * A.y -
		      C.x * C.x * B.x * A.y -
		      A.x * A.x * C.x * B.y -
		      B.x * B.x * A.x * C.y;
		
		return {			
			a: a/a,
			b: b/a,
			c: c/a
		};
	}

	function getEquationFromPoints(A, B, C) {

		const {a, b, c} = get2ndDegreeIndexes(A, B, C);
		return function(x) {
			return a * x * x + b * x + c;
		};
	}
	
  return {
	  calculateDelta, calculateDelta,
	  findRoots: findRoots,
	  findAngleToShoot: findAngleToShoot,
	  findStrengthToShoot: findStrengthToShoot,
	  getB: getB,
	  getC: getC,
	  get2ndDegreeIndexes: get2ndDegreeIndexes,
	  getEquationFromPoints: getEquationFromPoints
  };
});
