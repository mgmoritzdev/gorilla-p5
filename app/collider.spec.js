define(['collider'], function(Collider) {
  describe('Object creation', function() {
    it('Should create an object collider', function() {
      const collider = new Collider();
      expect(collider).toBeDefined();
    });
  });
});
