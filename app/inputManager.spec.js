define(['inputManager'],function (im) {

	describe('Should', function () {
		it('be defined', function () {
			expect(im).toBeDefined();
		});
	});

	describe('Should allow clients to', function() {

		var obj1 = {};
		var obj2 = {};

		beforeEach(function() {
			im.removeAllSubscriptions();
		});

		it('subscribe for events', function() {
			im.subscribe(obj1);
			im.subscribe(obj2);

			expect(im.countSubscribers()).toBe(2);
		});

		it('remove a subscription', function() {
			var sub1 = im.subscribe(obj1);
			var sub2 = im.subscribe(obj2);
			im.unsubscribe(sub1);

			expect(im.countSubscribers()).toBe(1);
		});

		it('remove all subscriptions', function() {
			im.subscribe(obj1);
			im.subscribe(obj2);

			im.removeAllSubscriptions();

			expect(im.countSubscribers()).toBe(0);
		});
	});

	describe('Should implement a handle for', function() {

		function onEvent(eventName) {
			spyOn(im, eventName);

			var event = {};
			im[eventName](event);

			expect(im[eventName]).toBeDefined();
			expect(im[eventName]).toHaveBeenCalled();
		}

		it('onClickEnter', function() {
			onEvent('onClickEnter');
		});

		it('onClickExit', function() {
			onEvent('onClickExit');
		});

		it('onClickDrag', function() {
			onEvent('onClickDrag');
		});

		it('onKeyEnter', function() {
			onEvent('onKeyEnter');
		});

		it('onKeyExit', function() {
			onEvent('onKeyExit');
		});
	});

	describe('Should call the client\'s implementation for', function() {

		function onEvent(eventName) {

			var obj = {};
			obj[eventName] = function(event) {
				obj.a = event;
			};
			
			spyOn(obj, eventName).and.callThrough();

			var event = 'success';
			var sub = im.subscribe(obj);
			im.registerCallback(sub, eventName, obj[eventName]);
			im[eventName](event);

			expect(obj[eventName]).toHaveBeenCalled();
			expect(obj.a).toBe(event);
		}
		
		it('onClickEnter', function() {
			onEvent('onClickEnter');
		});

		it('onClickExit', function() {
			onEvent('onClickExit');
		});

		it('onClickDrag', function() {
			onEvent('onClickDrag');
		});

		it('onKeyEnter', function() {
			onEvent('onKeyEnter');
		});

		it('onKeyExit', function() {
			onEvent('onKeyExit');
		});

	});

	describe('Should allow clients to set the region', function() {
		function onEvent(eventName) {

			var obj = {};
			obj[eventName] = function(event) {
				obj.a = event;
			};

			function onAreaCallback(event) {
				var rectangle = { x: 10, y: 10, w: 10, h: 10 };
				return (event.x > rectangle.x &&
				        event.x < rectangle.x + rectangle.w &&
				        event.y > rectangle.y && event.y < rectangle.y + rectangle.h);
			}
			
			spyOn(obj, eventName).and.callThrough();

			var event1 = { x: 15, y: 15 };
			var event2 = { x: 15, y: 25 };
			
			var sub = im.subscribe(obj);
			im.setEventArea(sub, onAreaCallback);
			
			im[eventName](event1);
			im[eventName](event2);

			expect(obj[eventName]).toHaveBeenCalled();
			expect(obj.a).toBe(event1); // and not event2, given it doesn't trigger the callback.
		}

		it('where the input triggers the callback', function() {
			onEvent('onClickEnter');
			onEvent('onClickExit');
			onEvent('onClickDrag');
			onEvent('onKeyEnter');
			onEvent('onKeyExit');
		});
	});
});
