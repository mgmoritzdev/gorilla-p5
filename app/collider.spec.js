define(['collider', 'vector2'], function(Collider, Vector2) {
  describe('Should allow to', function() {

	  it('create of a simple collider', function() {
      const collider = new Collider();
      expect(collider).toBeDefined();
    });

	  it('create a collider and specify the position', function() {
		  const collider = new Collider(new Vector2());
	  });
  });

	describe('Should allow to', function() {

		let collider;
		
		beforeEach(function() {
			
			collider = new Collider();

		});
		
		it('add a collider to check against this', function() {


			const otherCollider = new Collider();
			expect(collider.collidersToCheck.length).toEqual(0);

			collider.addColliderToCheck(otherCollider);

			expect(collider.collidersToCheck.length).toBeGreaterThan(0);

		});

		it('remove a collider from the list of colliders to check agains this', function() {

			const otherCollider = new Collider();

			collider.addColliderToCheck(otherCollider);
			collider.removeColliderToCheck(otherCollider);

			expect(collider.collidersToCheck.length).toEqual(0);
		});
		
	});

	describe('Should not allow to', function() {

		let collider;
		
		beforeEach(function() {
			
			collider = new Collider();

		});

		it('add a non-collider to a the list of colliders to check agains this', function() {

			const notACollider = 'a string';

			expect(() => collider.addColliderToCheck(notACollider)).toThrow();
			
		});
	});
	
});
