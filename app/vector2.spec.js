define(['vector2'],function (Vector2){

  describe('Copy constructor:', function () {
    
    var p1 = new Vector2(1, 4);
    var p2 = p1.copy();

    it('Should create a new vector', function () {
      expect(p1).not.toBe(p2);
    });

    it('Should create a vector internally equal to the original', function () {
      expect(p1).toEqual(p2);
    });
  });
  describe('Should be able to', function () {
    it('add a zero vector without change its original value', function () {
      var p1 = new Vector2(0, 1);
      var p2 = new Vector2(0, 0);
      var p3 = p1.copy();

      p1.addVector(p2);
      expect(p1).toEqual(p3);
    });
    it('add the x and y components', function () {
      var p1 = new Vector2(0, 1);
      var p2 = new Vector2(1, 0);
      var p3 = new Vector2(1, 1);

      p1.addVector(p2);

      expect(p1).toEqual(p3);
    });
  });
	describe('Should be able to', function() {
		it('subtract a vector', function() {
			var p1 = new Vector2(0, 1);
			var p2 = new Vector2(1, 1);
			var p3 = new Vector2(4, 10);
			var p4 = new Vector2(2, 3);

			p1.subtractVector(p2);
			expect(p1).toEqual(new Vector2(-1, 0));

			p3.subtractVector(p4);
			expect(p3).toEqual(new Vector2(2, 7));
			
		});
	});
	describe('Multiply a vector with', function() {
		it('a constant', function() {
			const p1 = new Vector2(0, 230);
			const c = 1/10;

			p1.multiplyConst(c);
			expect(p1).toEqual(new Vector2(0, 23));
		});

	});
  describe('Euclidean Distance', function () {
    it('dist', function () {
      var p1 = new Vector2(0, 0);
      var p2 = new Vector2(0, 1);
      var p3 = new Vector2(1, 0);
      var p4 = new Vector2(1, 1);
      var p5 = new Vector2(-1, -1);

      expect(p1.dist(p2)).toEqual(1);
      expect(p1.dist(p3)).toEqual(1);
      expect(p1.dist(p4)).toBeCloseTo(1.41, 2);
      expect(p1.dist(p5)).toBeCloseTo(1.41, 2);
    });
  });
  describe('Squared Euclidean Distance', function () {
    it('sqDist', function () {
      var p1 = new Vector2(0, 0);
      var p2 = new Vector2(0, 1);
      var p3 = new Vector2(1, 0);
      var p4 = new Vector2(1, 1);
      var p5 = new Vector2(2, 2);
      var p6 = new Vector2(3, -3);

      expect(p1.sqDist(p2)).toEqual(1);
      expect(p1.sqDist(p3)).toEqual(1);
      expect(p1.sqDist(p4)).toEqual(2);
      expect(p1.sqDist(p5)).toEqual(8);
      expect(p1.sqDist(p6)).toEqual(18);
    });
  });
	describe('Should properties like', function() {
		it('magnitude', function() {
			var p1 = new Vector2(0, 0);
      var p2 = new Vector2(0, 1);
      var p3 = new Vector2(1, 1);

			expect(p1.magnitude()).toEqual(0);
			expect(p2.magnitude()).toEqual(1);
			expect(p3.magnitude()).toBeCloseTo(1.41, 2);
		});
	});
});
