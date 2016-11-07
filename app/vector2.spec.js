define(['vector2'],function (Vector2){
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