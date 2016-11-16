define(['banana', 'vector2'],function (Banana, Vector2) {

	let banana;
		
	beforeEach(function() {

		const mass = 10;
		const gravity = 9.81 / 60;
		
		banana = new Banana(mass, gravity);
	});
	
	describe('Object creation', function () {

		it('Should create a banana object', function () {

			expect(banana).toBeDefined();

		});

		it('Should have physics property', function() {

			const position = new Vector2(0,0);
      const velocity = new Vector2(15,15);
      const size = new Vector2(0,0);

      banana.physics.setPosition(position);
			banana.physics.setVelocity(velocity);

			for(var i = 0; i < 15; i++) {
				banana.physics.update();
			}

			expect(banana.physics).toBeDefined();
			
    });

  });

	describe('Should have functions like', function() {
		it('update', function() {

			expect(banana.update).toBeDefined();

		});

		it('render', function() {

			expect(banana.render).toBeDefined();
			
		});
		
	});
	
});
