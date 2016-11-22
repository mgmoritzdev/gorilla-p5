define(['collisionManager', 'circularCollider', 'vector2'], function(CollisionManager, Collider, Vector2) {

	let cm;
	
	beforeEach(function() {
		cm = CollisionManager;
	});	
	
	describe('Should allow to', function() {

		it('have a referece to the collision manager', function() {

			expect(cm).toBeDefined();

		});
		
	});

	describe('Should allow collider manipulation such as', function() {

		beforeEach(function() {
			cm.removeAllColliders();
		});
		
		it('add a collider', function() {

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

		it('add a collider and keep dynamic colliders in the beginning of the array', function() {

			const staticColl1 = new Collider();
			const staticColl2 = new Collider();
			const staticColl3 = new Collider();
			const dynamicColl1 = new Collider();
			const dynamicColl2 = new Collider();
			const dynamicColl3 = new Collider();

			staticColl1.setStatic(true);
			staticColl2.setStatic(true);
			staticColl3.setStatic(true);			
			
			cm.addCollider(staticColl1);
			cm.addCollider(dynamicColl2);
			cm.addCollider(staticColl2);
			cm.addCollider(staticColl3);
			cm.addCollider(dynamicColl1);
			cm.addCollider(dynamicColl3);
			
			expect(cm.getColliders()[0].static).toBe(false);
			expect(cm.getColliders()[1].static).toBe(false);
			expect(cm.getColliders()[2].static).toBe(false);

			expect(cm.getColliders()[3].static).toBe(true);
			expect(cm.getColliders()[4].static).toBe(true);
			expect(cm.getColliders()[5].static).toBe(true);
						
		});

		it('remove a collider', function() {

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

	describe('Should be able to check collisions between cicles', function() {

		beforeEach(function() {
			cm.removeAllColliders();
		});


		it('and return a collision object case it collides', function() {

			const circleColl1 = new Collider();
			const circleColl2 = new Collider();

			circleColl1.setPosition(new Vector2(10, 10));
			circleColl2.setPosition(new Vector2(10, 15));

			circleColl1.setDiameter(6);
			circleColl2.setDiameter(6);

			const collision = cm.checkCollision(circleColl1, circleColl2);
			expect(collision.penetration).toBe(1);
			expect(collision.normal).toEqual(new Vector2(0, 5));
		});
	});

	describe('Should be able to check collisions between cicles', function() {

		beforeEach(function() {
			cm.removeAllColliders();
		});

		it('and return null if it not collides', function() {

			const circleColl1 = new Collider();
			const circleColl2 = new Collider();

			circleColl1.setPosition(new Vector2(10, 10));
			circleColl2.setPosition(new Vector2(10, 15));

			circleColl1.setDiameter(4);
			circleColl2.setDiameter(4);
			
			const collision = cm.checkCollision(circleColl1, circleColl2);
			expect(collision).toBe(null);

		});
	});

	describe('Should calculate collisions on update for all colliders', function() {

		beforeEach(function() {
			cm.removeAllColliders();
		});

		it('and apply a callback in the case it collides', function() {

			const circleColl1 = new Collider();
			const circleColl2 = new Collider();

			let collision12;
			let collision21;
			
			circleColl1.onCollision = function(collision) {
				collision12 = collision;
			};

			circleColl2.onCollision = function(collision) {
				collision21 = collision;
			};
			
			spyOn(circleColl1, 'onCollision').and.callThrough();
			spyOn(circleColl2, 'onCollision').and.callThrough();
			
			circleColl1.setPosition(new Vector2(10, 10));
			circleColl2.setPosition(new Vector2(10, 15));

			circleColl1.setDiameter(6);
			circleColl2.setDiameter(6);

			cm.addCollider(circleColl1);
			cm.addCollider(circleColl2);

			cm.update();

			expect(circleColl1.onCollision).toHaveBeenCalled();
			expect(circleColl2.onCollision).toHaveBeenCalled();
			expect(collision12.normal.magnitude()).toEqual(5);
			expect(collision21.normal.magnitude()).toEqual(5);
			expect(collision12.normal.x).toBe(-collision21.normal.x);
			expect(collision12.normal.y).toBe(-collision21.normal.y);
			
		});
	});
});
