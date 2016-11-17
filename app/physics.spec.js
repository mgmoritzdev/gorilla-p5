define(['physics', 'vector2'],function (Physics, Vector2){

	
	let collider;

	// mock collider
	beforeEach(function() {
		collider = {};
		collider.setPosition = function() {};
	});

	describe('Should allow to create: ', function () {

    it('a simple physics object', function () {
      
      const physics = new Physics();
      
      expect(physics).toBeDefined();
      expect(physics.position).toBeDefined();
      expect(physics.rotation).toBeDefined();

    });
  });

  describe('Should allow to change it\'s internal state changing: ', function () {

    it('the position', function () {
      
      const physics = new Physics();
      physics.setPosition(new Vector2(0, 2));
      
      expect(physics.position).toEqual(new Vector2(0, 2));

    });

    it('the velocity', function () {
      
      const physics = new Physics();
      physics.setVelocity(new Vector2(0, 2));
      
      expect(physics.velocity).toEqual(new Vector2(0, 2));

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

	    const physics = new Physics();
      physics.addCollider(collider);

      expect(physics.colliders).toBeDefined();
      expect(physics.colliders.length).toBeGreaterThan(0);
      expect(physics.colliders[0]).toBe(collider);
      
    });

    it('acceleration', function() {
      
      const physics = new Physics();      
      physics.setAcceleration(new Vector2(1, 1));

      expect(physics.acceleration).toBeDefined();

    });

	  it('force', function() {

		  const physics = new Physics();
		  physics.addForce(new Vector2(1, 1));

		  expect(physics.forces.length).toBeGreaterThan(0);
	  });
  });

  describe('Should allow removing properties such as: ', function() {

    it('rigid body', function () {
      
      const mass = 10;
      const gravity = 9.81;

      const physics = new Physics();
      physics.addRigidBody(mass, gravity);

	    expect(physics.forces).toBeDefined();
	    
	    
      physics.removeRigidBody(0);

      expect(physics.mass).not.toBeDefined();
      expect(physics.gravity).not.toBeDefined();

    });

    it('collider', function () {
      
      const physics = new Physics();
      physics.addCollider(collider);

	    expect(physics.colliders.length).toBeGreaterThan(0);
	    
      physics.removeCollider(collider);

      expect(physics.colliders.length).toEqual(0);
      
    });

    it('force', function () {
      
      const force = new Vector2();

      const physics = new Physics();
	    physics.addForce(force);

	    expect(physics.forces.length).toBeGreaterThan(0);
	    
      physics.removeForce(force);

      expect(physics.forces.length).toEqual(0);
      
    });

	  
    it('acceleration', function() {
      
      const physics = new Physics();      
      physics.setAcceleration(new Vector2(1, 1));
      physics.removeAcceleration();

      expect(physics.acceleration).not.toBeDefined();

    });
  });

  describe('Should allow control the object with operations such as: ', function () {

    it('move', function () {
      
      const initialPosition = new Vector2(10, 10);
      const displacement = new Vector2(5, 5);

      const physics = new Physics();
      physics.setPosition(initialPosition);
      physics.move(displacement);

      expect(physics.position).toEqual(new Vector2(15, 15));

    });
  });

  describe('Should allow updates: ', function () {

    it('with fixed velocity', function () {
      const initialPosition = new Vector2(8, 5);
      const velocity = new Vector2(10, 10);

      const physics = new Physics();
      physics.setPosition(initialPosition);
      physics.setVelocity(velocity);

      physics.update();

      expect(physics.position).toEqual(new Vector2(18, 15));

      physics.update();

      expect(physics.position).toEqual(new Vector2(28, 25));

    });

    it('with constant acceleration' , function() {

	    const acc = new Vector2(0, 9.81);
	    const physics = new Physics();

	    physics.setAcceleration(acc);

	    physics.update();

	    expect(physics.velocity).toEqual(new Vector2(0, 9.81));
	    
    });

    it('with rigidbody' , function() {

	    const mass = 10;
	    const gravity = 9.81;
	    const physics = new Physics();

	    physics.addRigidBody(mass, gravity);

	    // the first update changes the acceleration, but not the velocity
	    physics.update();

	    // in this update, the previous set acceleration is applied to change velocity
	    physics.update();

	    expect(physics.velocity.y).toBeCloseTo(9.81, 2);
    });

	  it('with a force applied', function() {

		  const mass = 10;
		  const gravity = 0; // to isolate effect of the force
		  const physics = new Physics();

		  physics.addRigidBody(mass, gravity);
		  physics.addForce(new Vector2(10, 10));
		  
		  // see explanation in previous test
		  physics.update();
		  physics.update();

		  expect(physics.velocity.x).toBeCloseTo(1);
		  expect(physics.velocity.y).toBeCloseTo(1);

		  // multiple updates should not increase acceleration
		  const acc = physics.acceleration.copy();

		  for(var i = 0; i < 15; i++) {
			  physics.update();			  
		  }

		  expect(physics.acceleration).toEqual(acc);
		  
	  });

  });

});
