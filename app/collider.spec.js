define(['collider', 'vector2'], function(Collider, Vector2) {

	let collider;
	
	beforeEach(function() {
		collider = new Collider();
	});

	describe('Should allow to', function() {	  
	  it('create of a simple collider', function() {
		  collider = new Collider();
      expect(collider).toBeDefined();
    });

	  it('create a collider and specify the position', function() {
		  collider = new Collider(new Vector2());
	  });
  });

	describe('Should allow to', function() {
		it('set a position property', function() {
			const pos = new Vector2(10, 10);
			collider.setPosition(pos);

			expect(collider.position).toBe(pos);
		});
		it('set a type', function() {
			collider.setType('circular');
			expect(collider.type).toEqual('circular');
		});
	});
	
});
