define(['inputSubscriber'],function (Subscriber) {
	describe('Should allow users to create a inputManager subscription object', function() {
		it('with no callbacks', function() {
			var obj = {};
			
			var sub = new Subscriber(obj);

			expect(sub).toBeDefined();
			expect(sub.obj).toBeDefined();
		});
	});

	describe('Should allow users to register callbacks', function() {
		it('for events', function() {
			var obj = {};
			var sub = new Subscriber(obj);
			var eventName = 'onClickEnter';
			var callback = function (event) {
				
			};
			
			sub.registerCallback(eventName, callback);
			expect(sub[eventName]).toBeDefined();
		});

		it('for event area', function() {
			var obj = {};
			var sub = new Subscriber(obj);
			var onEventAreaCallback = function (event) {
				var rectangle = { x: 10, y: 10, w: 10, h: 10 };
				return (event.x > rectangle.x &&
				        event.x < rectangle.x + rectangle.w &&
				        event.y > rectangle.y && event.y < rectangle.y + rectangle.h);
			};

			sub.setEventAreaCallback(onEventAreaCallback);

			var event1 = { x: 15, y: 15 };
			var event2 = { x: 15, y: 25 };

			expect(sub.onEventArea).toBeDefined();
			expect(sub.onEventArea(event1)).toBe(true);
			expect(sub.onEventArea(event2)).toBe(false);
		});
	});
});
