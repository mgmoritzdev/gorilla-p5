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
			im.subscribe(obj1);
			im.subscribe(obj2);
			im.unsubscribe(obj1);

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

		it('onKeyPress', function() {
			onEvent('onKeyPress');
		});

		it('onKeyRelease', function() {
			onEvent('onKeyRelease');
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
			im.subscribe(obj);
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

		it('onKeyPress', function() {
			onEvent('onKeyPress');
		});

		it('onKeyRelease', function() {
			onEvent('onKeyRelease');
		});

	});

});
