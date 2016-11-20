define('collision', function() {

	const Collision = function(coll1, coll2, penetration, normal) {
		this.coll1 = coll1;
		this.coll2 = coll2;
		this.penetration = penetration;
		this.normal = normal;
	};

	return Collision;
});
