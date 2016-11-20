define(['collisionManager', 'circularCollider', 'vector2'], function(CollisionManager, Collider, Vector2) {

	let cm;
	
	beforeEach(function() {
		
		// CollisionManager is a simple object, it is necessary to clean up it's state in every test case
		cm = CollisionManager;
		cm.removeAllColliders();
		
	});
	
	describe('Should allow to', function() {

		it('have a referece to the collision manager', function() {

			expect(cm).toBeDefined();

		});
		
	});

	describe('Should allow collider manipulation such as', function() {

		it('add a collider', function() {

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

		it('remove a collider', function() {

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

	describe('Should be able to check collisions between cicles', function() {
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
