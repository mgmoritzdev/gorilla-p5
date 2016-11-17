define(['collider'], function(Collider) {

	let colliders = [];
	
	function addCollider(collider) {

		if (!(collider instanceof Collider)) {
			throw new Error("The object is not an instance of Collider");
		}
		
		colliders.push(collider);
	}

	function removeCollider(collider) {

		const index = colliders.indexOf(collider);

		if (index > -1) {
			colliders.splice(index, 1);
		}
		
	}

	function getColliders() {
		return colliders;
	}

	function removeAllColliders() {
		colliders = [];
	}

	return {
		addCollider: addCollider,
		removeCollider: removeCollider,
		getColliders: getColliders,
		removeAllColliders: removeAllColliders
	};
	
});
