define(['banana', 'vector2'],function (Banana, Vector2){
  describe('Object creation', function () {

    it('Should create a banana object', function () {
      const position = new Vector2(0,0);
      const velocity = new Vector2(0,0);
      const size = new Vector2(0,0);

      const banana = new Banana(position, velocity, size);
      
      expect(banana).toBeDefined();
      expect(banana.position).toBe(position);
      expect(banana.velocity).toBe(velocity);
      expect(banana.size).toBe(size);

    });

  });

});
