define(['physics', 'vector2'],function (Physics, Vector2){
  describe('Object creation', function () {

    it('Should create a physics object', function () {
      
      const physics = new Physics();
      
      expect(physics).toBeDefined();
      expect(physics.position).toBeDefined();
      expect(physics.velocity).toBeDefined();

    });

    it('Should allow position and velocity parameters', function () {
      
      const physics = new Physics(new Vector2(1,1), new Vector2(2,2));
      
      expect(physics.position).toEqual(new Vector2(1,1));
      expect(physics.velocity).toEqual(new Vector2(2,2));

    });

    it('Should allow creation of a rigid body', function () {
      
      const mass = 10;
      const gravity = 9.81;

      const physics = new Physics();
      physics.addRigidBody(mass, gravity);

      expect(physics.mass).toEqual(mass);
      expect(physics.gravity).toEqual(gravity);

    });

    it('Should allow creation of a collider', function () {
      
      const collider = 'collider';

      const physics = new Physics();
      physics.addCollider(collider);

      expect(physics.colliders).toBeDefined();
      expect(physics.colliders.length).toBeGreaterThan(0);
      expect(physics.colliders[0]).toBe(collider);
      
    });
  });

  describe('Object manipulation', function () {

    it('Should allow to move the object', function () {
      
      const initialPosition = new Vector2(10, 10);
      const displacement = new Vector2(5, 5);

      const physics = new Physics(initialPosition);
      physics.move(displacement);

      expect(physics.position).toEqual(new Vector2(15, 15));

    });
  });

});
