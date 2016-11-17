define(['collisionManager', 'collider'], function(CollisionManager, Collider) {

	let cm;
	
	beforeEach(function() {
		
		// CollisionManager is a singleton, it is necessary to clean up it's state in every test case
		cm = CollisionManager;
		cm.removeAllColliders();
		
	});
	
	describe('Should allow to', function() {

		it('have a referece to the collision manager', function() {

			expect(cm).toBeDefined();			

		});
		
	});

	describe('Should allow', function() {

		it('to add a collider', function() {

			cm = CollisionManager;
			expect(cm.getColliders().length).toEqual(0);

			// invalid collider
			const coll1 = 'collider'; 
			expect(() => cm.addCollider(coll1)).toThrow();
			expect(cm.getColliders().length).toEqual(0);

			// valid collider
			const coll2 = new Collider();
			cm.addCollider(coll2);
			
			expect(cm.getColliders().length).toEqual(1);
			
		});

		it('to remove a collider', function() {

			// 
			expect(cm.getColliders().length).toEqual(0);

			// add two colliders to manager
			const coll1 = new Collider();
			const coll2 = new Collider();
			cm.addCollider(coll1);
			cm.addCollider(coll2);

			expect(cm.getColliders().length).toEqual(2);

			// remove the first
			cm.removeCollider(coll1);
			
			expect(cm.getColliders().length).toEqual(1);
			
		});

	});
	
});
