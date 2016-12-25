define([], function () {

	// rename to inputSubscriber
	var Subscription = function(obj) {
		var sub = this;
		sub.obj = obj;
  };

	Subscription.prototype.registerCallback = function(eventName, callback) {
		this[eventName] = callback;
	};

	return Subscription;

});
