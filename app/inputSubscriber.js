define([], function () {

	var InputSubscriber = function(obj) {
		var sub = this;
		sub.obj = obj;
		sub.onAreaCallback = function () {
			return true;
		};
  };

	InputSubscriber.prototype.registerCallback = function(eventName, callback) {
		this[eventName] = callback;
	};

	InputSubscriber.prototype.setEventAreaCallback = function (callback) {
		this.onEventArea = callback;
	};

	return InputSubscriber;

});
