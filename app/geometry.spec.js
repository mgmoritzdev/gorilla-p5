define(['geometry'],function (geometry){
  describe('Convert degrees to radians', function () {
    it('Should work with positive values', function () {
      expect(geometry.radians(0)).toEqual(0);
      expect(geometry.radians(45)).toBeCloseTo(0.7854, 4);
      expect(geometry.radians(60)).toBeCloseTo(1.0472, 4);
      expect(geometry.radians(180)).toBeCloseTo(Math.PI, 4);
    });
    it('Should work with negative values', function () {
      expect(geometry.radians(-0)).toEqual(-0);
      expect(geometry.radians(-45)).toBeCloseTo(-0.7854, 4);
      expect(geometry.radians(-60)).toBeCloseTo(-1.0472, 4);
      expect(geometry.radians(-180)).toBeCloseTo(-Math.PI, 4);
    });
    it('Should work with positive greater than 180', function () {
      expect(geometry.radians(180 + 45)).toBeCloseTo(Math.PI + 0.7854, 4);
      expect(geometry.radians(180 + 60)).toBeCloseTo(Math.PI + 1.0472, 4);
    });
  });
  describe('Convert radians to degrees', function () {
    it('Should work with positive values', function () {
      expect(geometry.degrees(0)).toEqual(0);
      expect(geometry.degrees(0.7854)).toBeCloseTo(45, 0);
      expect(geometry.degrees(1.0472)).toBeCloseTo(60, 0);
      expect(geometry.degrees(Math.PI)).toBeCloseTo(180, 0);
    });
    it('Should work with negative values', function () {
      expect(geometry.degrees(-0)).toEqual(-0);
      expect(geometry.degrees(-0.7854)).toBeCloseTo(-45, 0);
      expect(geometry.degrees(-1.0472)).toBeCloseTo(-60, 0);
      expect(geometry.degrees(-Math.PI)).toBeCloseTo(-180, 0);
    });
    it('Should work with positive values greater than PI', function () {
      expect(geometry.degrees(Math.PI + 0.7854)).toBeCloseTo(180 + 45, 0);
      expect(geometry.degrees(Math.PI + 1.0472)).toBeCloseTo(180 + 60, 0);
    });
  });
  describe('Wrap angle', function () {
    it('Should not change with values under 360', function () {
      expect(geometry.wrapAngle(0)).toEqual(0);
      expect(geometry.wrapAngle(45)).toEqual(45);
    });
    it('Should reduce negative angles', function () {
      expect(geometry.wrapAngle(-45)).toEqual(315);
      expect(geometry.wrapAngle(-180)).toEqual(180);
    });
    it('Should reduce angles greater than 360', function () {
      expect(geometry.wrapAngle(360)).toEqual(0);
      expect(geometry.wrapAngle(361)).toEqual(1);
      expect(geometry.wrapAngle(405)).toEqual(45);
      expect(geometry.wrapAngle(540)).toEqual(180);
      expect(geometry.wrapAngle(720)).toEqual(0);
      expect(geometry.wrapAngle(721)).toEqual(1);
      expect(geometry.wrapAngle(-361)).toEqual(359);
    });
    it('Should reduce negative angles even when it\'s module is bigger than 360', function () {
      expect(geometry.wrapAngle(-360)).toEqual(0);
      expect(geometry.wrapAngle(-361)).toEqual(359);
      expect(geometry.wrapAngle(-405)).toEqual(315);
      expect(geometry.wrapAngle(-540)).toEqual(180);
      expect(geometry.wrapAngle(-720)).toEqual(0);
      expect(geometry.wrapAngle(-721)).toEqual(359);
    });
  });
});