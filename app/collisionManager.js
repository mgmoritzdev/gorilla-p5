define(['collider', 'collision', 'vector2'], function(Collider, Collision, Vector2) {

	var colliders = [];
	
	function addCollider(collider) {

		if (!(collider instanceof Collider)) {
			throw new Error("The object is not an instance of Collider");			
		}
		
		colliders.push(collider);
		sortColliders();
	}

	function removeCollider(collider) {

		var index = colliders.indexOf(collider);

		if (index > -1) {
			colliders.splice(index, 1);
		}
		
	}

	function sortColliders() {
		colliders = colliders.sort(function(x, y) {
			return x.static ? 1 : -1;
		});
	}

	function getDynamicColliders() {
		return colliders.filter(function(x) {
			return !x.static;
		});
	}

	function getColliders() {
		return colliders;
	}

	function removeAllColliders() {
		colliders.length = 0;
	}

	function update() {

		var dynColl = getDynamicColliders();
		
		for (var i = 0; i < dynColl.length; i++) {
			for (var j = i + 1; j < colliders.length; j++) {
				var coll1 = colliders[i];
				var coll2 = colliders[j];
				var collision = checkCollision(coll1, coll2);
				if (collision !== null) {
					coll1.notify(collision);
					coll2.notify(invertNormal(collision));
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
		var sqDist = coll1.position.sqDist(coll2.position);
		var avgDiam = coll1.diameter/2 + coll2.diameter/2;
		var sqAvgDiam = avgDiam * avgDiam;
		
		if (sqDist > sqAvgDiam) {
			return null;
		}
		var penetration = avgDiam - coll1.position.dist(coll2.position);
		var normal = coll2.position.copy();
		normal.subtractVector(coll1.position);
		return new Collision(coll1, coll2, penetration, normal);
	}

	function renderAllColliders() {
		colliders.forEach(function(c) {
			return c.render();
		});
	}

	return {
		addCollider: addCollider,
		removeCollider: removeCollider,
		getColliders: getColliders,
		removeAllColliders: removeAllColliders,
		checkCollision: checkCollision,
		update: update,
		renderAllColliders: renderAllColliders
	};
	
});
