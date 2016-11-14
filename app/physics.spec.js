define(['physics', 'vector2'],function (Physics, Vector2){
  describe('Should allow to create: ', function () {

    it('a simple physics object', function () {
      
      const physics = new Physics();
      
      expect(physics).toBeDefined();
      expect(physics.position).toBeDefined();
      expect(physics.rotation).toBeDefined();

    });

    it('a physics object defining position and velocity parameters', function () {
      
      const physics = new Physics(new Vector2(1,1), 45);
      
      expect(physics.position).toEqual(new Vector2(1,1));
      expect(physics.rotation).toEqual(45);

    });
  });

  describe('Should allow to change it\'s internal state changing: ', function () {

    it('the position', function () {
      
      const physics = new Physics();
      physics.setPosition(new Vector2(0, 2));
      
      expect(physics.position).toEqual(new Vector2(0, 2));

    });
    it('the rotation', function () {
      
      const physics = new Physics();
      physics.setRotation(45);
      
      expect(physics.rotation).toEqual(45);

    });

  });

  describe('Should allow adding properties such as: ', function() {

    it('rigid body', function () {
      
      const mass = 10;
      const gravity = 9.81;

      const physics = new Physics();
      physics.addRigidBody(mass, gravity);

      expect(physics.mass).toEqual(mass);
      expect(physics.gravity).toEqual(gravity);

    });

    it('collider', function () {
      
      const collider = 'collider';

      const physics = new Physics();
      physics.addCollider(collider);

      expect(physics.colliders).toBeDefined();
      expect(physics.colliders.length).toBeGreaterThan(0);
      expect(physics.colliders[0]).toBe(collider);
      
    });
  });

  describe('Should allow control the object with operations such as: ', function () {

    it('move', function () {
      
      const initialPosition = new Vector2(10, 10);
      const displacement = new Vector2(5, 5);

      const physics = new Physics(initialPosition);
      physics.move(displacement);

      expect(physics.position).toEqual(new Vector2(15, 15));

    });
  });

});
