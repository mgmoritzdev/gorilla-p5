define('collision', function() {

	var Collision = function(coll1, coll2, penetration, normal) {
		this.coll1 = coll1;
		this.coll2 = coll2;
		this.penetration = penetration;
		this.normal = normal;
	};

	return Collision;
});
