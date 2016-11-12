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
  describe('Add vectors:', function () {
    it('add a zero vector should not change value', function () {
      var p1 = new Vector2(0, 1);
      var p2 = new Vector2(0, 0);
      var p3 = p1.copy();

      p1.addVector(p2);
      expect(p1).toEqual(p3);
    });
    it('Should add the x and y components', function () {
      var p1 = new Vector2(0, 1);
      var p2 = new Vector2(1, 0);
      var p3 = new Vector2(1, 1);

      p1.addVector(p2);

      expect(p1).toEqual(p3);
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
});