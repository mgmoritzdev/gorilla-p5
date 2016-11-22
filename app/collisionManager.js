define(['collider', 'collision', 'vector2'], function(Collider, Collision, Vector2) {

	let colliders = [];
	
	function addCollider(collider) {

		if (!(collider instanceof Collider)) {
			throw new Error("The object is not an instance of Collider");			
		}
		
		colliders.push(collider);
		sortColliders();
	}

	function removeCollider(collider) {

		const index = colliders.indexOf(collider);

		if (index > -1) {
			colliders.splice(index, 1);
		}
		
	}

	function sortColliders() {
		colliders = colliders.sort((x, y) => x.static ? 1 : -1 );
	}

	function getDynamicColliders() {
		return colliders.filter((x) => !x.static);
	}

	function getColliders() {
		return colliders;
	}

	function removeAllColliders() {
		colliders.length = 0;
	}

	function update() {

		const dynColl = getDynamicColliders();
		
		for (let i = 0; i < dynColl.length; i++) {
			for (let j = i + 1; j < colliders.length; j++) {
				const coll1 = colliders[i];
				const coll2 = colliders[j];
				let collision = checkCollision(coll1, coll2);
				if (typeof(coll1.onCollision) !== 'undefined' && collision !== null) {
					coll1.onCollision(collision);
					coll2.onCollision(invertNormal(collision));
				}
			}	
		}
	};

	function invertNormal(collision) {
		return new Collision(
			collision.coll2,
			collision.coll1,
			collision.penetration,
			new Vector2(-collision.normal.x, -collision.normal.y)
		);
	}

	// actual implementation should move to support other collider types
	function checkCollision(coll1, coll2) {
		const sqDist = coll1.position.sqDist(coll2.position);
		const avgDiam = coll1.diameter/2 + coll2.diameter/2;
		const sqAvgDiam = avgDiam * avgDiam;
		
		if (sqDist > sqAvgDiam) {
			return null;
		}
		const penetration = avgDiam - coll1.position.dist(coll2.position);
		const normal = coll2.position.copy();
		normal.subtractVector(coll1.position);
		return new Collision(coll1, coll2, penetration, normal);
	}

	return {
		addCollider: addCollider,
		removeCollider: removeCollider,
		getColliders: getColliders,
		removeAllColliders: removeAllColliders,
		checkCollision: checkCollision,
		update: update
	};
	
});
