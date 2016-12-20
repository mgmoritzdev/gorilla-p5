define(['baskara', 'vector2'],function (baskara, Vector2) {
		
	beforeEach(function() {
	});
	
	describe('Should solve the baskara equation', function() {

		it('finding delta', function() {
			const a = 1, b = -2, c = -15;

			const delta = baskara.calculateDelta(a, b, c);
			expect(delta).toBe(64);
		});
		
		it('finding its roots', function () {
			const a = 1, b = -2, c = -15;

			const roots = baskara.findRoots(a, b, c);			
			
			expect(roots).toContain(-3);
			expect(roots).toContain(5);
			
		});		
	});

	describe('Should find a good angle to shoot', function() {
		it('given A is lower than B. A in the left side', function() {
			// lower means A.y is bigger than B.y
			const A = new Vector2(0, 10);
			const B = new Vector2(10, 5);

			const angle = baskara.findAngleToShoot(A, B);
			expect(angle).toBeGreaterThan(45);
			expect(angle).toBeLessThan(90);
		});

		it('given A is higher than B. A in the left side', function() {
			// higher means A.y is smaller than B.y
			const A = new Vector2(0, 0);
			const B = new Vector2(10, 100);

			const angle = baskara.findAngleToShoot(A, B);
			expect(angle).toBeLessThan(45);
			expect(angle).toBeGreaterThan(0);
		});

		it('given A is as high as B. A in the left side', function() {
			const A = new Vector2(0, 0);
			const B = new Vector2(10, 0);

			const angle = baskara.findAngleToShoot(A, B);
			expect(angle).toBe(45);
		});

		it('given A is lower than B. A in the right side', function() {
			// lower means A.y is bigger than B.y
			const A = new Vector2(10, 10);
			const B = new Vector2(0, 5);

			const angle = baskara.findAngleToShoot(A, B);
			expect(angle).toBeLessThan(135);
			expect(angle).toBeGreaterThan(90);
		});

		it('given A is higher than B. A in the right side', function() {
			// higher means A.y is smaller than B.y
			const A = new Vector2(10, 0);
			const B = new Vector2(0, 5);

			const angle = baskara.findAngleToShoot(A, B);
			expect(angle).toBeGreaterThan(135);
		});

		it('given A is as high as B. A in the right side', function() {
			const A = new Vector2(10, 0);
			const B = new Vector2(0, 0);

			const angle = baskara.findAngleToShoot(A, B);
			expect(angle).toBe(135);
		});

	});

	describe('Should find the params b and c for bàskara', function() {
		it('given A is in lower-left', function() {
			const A = new Vector2(0, 150);
			const B = new Vector2(30, 0);

			// determins the angle to be used
			const angle = baskara.findAngleToShoot(A, B);

			// given a = 1
			// calculates the b and c to pass through points A and B
			const b = baskara.getB(angle);
			const c = baskara.getC(B.x, angle);

			// some of its roots should be point B
			const roots = baskara.findRoots(1, b, c);

			expect(roots[0]).toBeCloseTo(B.x, 2);
		});
	});

	describe('Should be able to build the 2nd degree equation', function() {
		it('indexes a, b and c', function() {

			// given the equation f(x) = x² - 2x - 15
			// f(0) = -15
			// f(1) = -16
			// f(2) = -15
			const A = new Vector2(0, -15);
			const B = new Vector2(1, -16);
			const C = new Vector2(2, -15);

			// { a: 1, b: -2, c: -15 }
			const indexes = baskara.get2ndDegreeIndexes(A, B, C);

			expect(typeof(indexes)).toBe('object');
			expect(indexes.a).toBeDefined();
			expect(indexes.b).toBeDefined();
			expect(indexes.c).toBeDefined();
			expect(indexes.a).toBe(1);
			expect(indexes.b).toBe(-2);
			expect(indexes.c).toBe(-15);

			// given the equation f(x) = x² - 25x - 150
			// f(0) = -150
			// f(1) = -174
			// f(2) = -196
			const A2 = new Vector2(0, -150);
			const B2 = new Vector2(1, -174);
			const C2 = new Vector2(2, -196);

			// { a: 1, b: -25, c: -150 }
			const indexes2 = baskara.get2ndDegreeIndexes(A2, B2, C2);

			expect(typeof(indexes2)).toBe('object');
			expect(indexes2.a).toBeDefined();
			expect(indexes2.b).toBeDefined();
			expect(indexes2.c).toBeDefined();
			expect(indexes2.a).toBe(1);
			expect(indexes2.b).toBe(-25);
			expect(indexes2.c).toBe(-150);
		});

		it('function', function() {
			// given the equation f(x) = x² - 2x - 15
			// f(0) = -15
			// f(10) = -65
			// f(20) = -345
			const A = new Vector2(0, -15);
			const B = new Vector2(10, 65);
			const C = new Vector2(20, 345);

			var equation = baskara.getEquationFromPoints(A, B, C);

			expect(typeof(equation)).toBe('function');
			expect(equation(A.x)).toBe(A.y);
			expect(equation(B.x)).toBe(B.y);
			expect(equation(C.x)).toBe(C.y);
		});

		it('function', function() {
			// given the points
			// f(445) = 759;
			// f(1016) = 73;
			// f(1587) = 1055;
			const A = new Vector2(445, 759);
			const B = new Vector2(1016, 73);
			const C = new Vector2(1587, 1055);

			var indexes = baskara.get2ndDegreeIndexes(A, B, C);
			console.log(indexes);
			var equation = baskara.getEquationFromPoints(A, B, C);

			expect(typeof(equation)).toBe('function');
			expect(equation(A.x)).toBe(A.y);
			expect(equation(B.x)).toBe(B.y);
			expect(equation(C.x)).toBe(C.y);
		});
	});
});
