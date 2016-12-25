define(['subscription'],function (Sub) {
	describe('Should allow users to create a inputManager subscription object', function() {
		it('with no callbacks', function() {
			var obj = {};
			
			var sub = new Sub(obj);

			expect(sub).toBeDefined();
			expect(sub.obj).toBeDefined();
		});
	});

	describe('Should allow users to register callbacks', function() {
		it('and a function with the name provided should exist after that', function() {
			var obj = {};
			var sub = new Sub(obj);
			var eventName = 'onClickEnter';
			var callback = function (event) {
				
			};
			
			sub.registerCallback(eventName, callback);
			expect(sub[eventName]).toBeDefined();
		});
	});
});
