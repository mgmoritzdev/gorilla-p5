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

	describe('Should allow subscribers', function() {
		
		it('to subscribe', function() {

			// pass an emtpy callback to the collider
			collider.subscribe(function() {});			
			expect(collider.subscribers.length).toBe(1);			
			collider.subscribe(function() {});
			expect(collider.subscribers.length).toBe(2);
		});

		it('to be notified of an event', function() {

			// a dummy object to be changed in the subscribed callback
			var obj = { property1: 10, property2: 15 };
			
			// an object to hold the callbacks
			var callbackHolder = {};
			callbackHolder.callback1 = function() {
				obj.property1 = 20;
			};
			callbackHolder.callback2 = function() {
				obj.property2 = 25;
			};
			
			spyOn(callbackHolder, 'callback1').and.callThrough();
			spyOn(callbackHolder, 'callback2').and.callThrough();

			collider.subscribe(callbackHolder.callback1);
			collider.subscribe(callbackHolder.callback2);
			collider.notify();
			
			expect(collider.subscribers.length).toBe(2);
			expect(callbackHolder.callback1).toHaveBeenCalled();
			expect(callbackHolder.callback2).toHaveBeenCalled();
			expect(obj.property1).toBe(20);
			expect(obj.property2).toBe(25);
		});
	});
	
});
