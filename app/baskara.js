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

	// Get indexes using gaussian elimination
	function get2ndDegreeIndexes2(A, B, C) {

		var row1 = [ A.x * A.x, A.x, 1, A.y];
		var row2 = [ B.x * B.x, B.x, 1, B.y];
		var row3 = [ C.x * C.x, C.x, 1, C.y];
 
		var sortedRows = [ row1, row2, row3 ];
				
		// larger x goes first
		sortedRows.sort((p1, p2) => p2[0] - p1[0]);
				
		var factor;

		if (Math.abs(sortedRows[1][0]) > 0) {
			factor = sortedRows[0].map(x => x * (-sortedRows[1][0] / sortedRows[0][0]));
			sortedRows[1] = sortedRows[1].map((x, index) => x + factor[index]);
		}

		if (Math.abs(sortedRows[2][0]) > 0) {
			factor = sortedRows[0].map(x => x * (-sortedRows[2][0] / sortedRows[0][0]));
			sortedRows[2] = sortedRows[2].map((x, index) => x + factor[index]);
		}
		
		if (Math.abs(sortedRows[2][1]) > 0) {
			factor = sortedRows[1].map(x => x * (-sortedRows[2][1] / sortedRows[1][1]));
			sortedRows[2] = sortedRows[2].map((x, index) => x + factor[index]);		
		}

		const c = sortedRows[2][3] / sortedRows[2][2];
		const b = (sortedRows[1][3] - c * sortedRows[1][2]) / sortedRows[1][1];
		const a = (sortedRows[0][3] - c * sortedRows[0][2] - b * sortedRows[0][1]) / sortedRows[0][0];

		return {
			a: a,
			b: b,
			c: c
		};
	}

	// Solve using Cramer's Law
	function get2ndDegreeIndexes(A, B, C) {

		const a = getDet3x3(
			A.y, A.x, 1,
			B.y, B.x, 1,
			C.y, C.x, 1);

		const b = getDet3x3(
			A.x * A.x, A.y, 1,
			B.x * B.x, B.y, 1,
			C.x * C.x, C.y, 1);


		const c = getDet3x3(
			A.x * A.x, A.x, A.y,
			B.x * B.x, B.x, B.y,
			C.x * C.x, C.x, C.y);
		
		return {
			a: a,
			b: b,
			c: c
		};
	}

	/*find determinant of a 3x3 matrix using co-factor method
	// | a11 | a12 | a13 |
	// | a21 | a22 | a23 | = 
	// | a31 | a32 | a33 |

	// a11 * 
	// | a22 | a23 |
	// | a32 | a33 | 

	// - a12 *
	// | a21 | a23 |
	// | a31 | a33 |

	// + a13 *
	// | a21 | a22 |
	// | a31 | a32 |
	*/
	function getDet3x3(a11, a12, a13,
	            a21, a22, a23,
	            a31, a32, a33) {

		return a11 * getDet2x2(a22, a23, a32, a33) -
			a12 * getDet2x2(a21, a23, a31, a33) +
			a13 * getDet2x2(a21, a22, a31, a32);
	}
	
	function getDet2x2(a11, a12, a21, a22) {
		return a11 * a22 - a21 * a12;
	}

	function getEquationFromPoints(A, B, C) {

		const {a, b, c} = get2ndDegreeIndexes2(A, B, C);
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
	  get2ndDegreeIndexes2: get2ndDegreeIndexes2,
	  getEquationFromPoints: getEquationFromPoints
  };
});
