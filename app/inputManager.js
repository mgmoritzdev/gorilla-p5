define([], function() {

	var subscribers = [];	

	function subscribe(obj) {
		ensureProperties(obj);
		subscribers.push(obj);
	}

	function unsubscribe(obj) {
		var index = subscribers.indexOf(obj);
		if (index > -1) {
			subscribers.splice(index, 1);
		}
	}

	function removeAllSubscriptions() {
		subscribers.length = 0;
	}
	
	function onClickEnter(event) {
		onEvent('onClickEnter', event);
	}

	function onClickExit(event) {
		onEvent('onClickExit', event);
	}

	function onClickDrag(event) {
		onEvent('onClickDrag', event);
	}

	function onKeyPress(event) {
		onEvent('onKeyPress', event);
	}

	function onKeyRelease(event) {
		onEvent('onKeyRelease', event);
	}

	function countSubscribers() {
		return subscribers.length;
	}

	/* HELPERS */

	function onEvent(eventName, event) {
		subscribers.forEach(function(s) {
			if (s.onEventArea()) {
				s[eventName](event);
			}
		});
	}

	function ensureProperties(obj) {
		ensureOnEventArea(obj);
		ensureDefaultEvent(obj, 'onClickEnter');
		ensureDefaultEvent(obj, 'onClickExit');
		ensureDefaultEvent(obj, 'onClickDrag');
		ensureDefaultEvent(obj, 'onKeyPress');
		ensureDefaultEvent(obj, 'onKeyRelease');
	}
	
	function ensureDefinition(prop, type, obj, defaultValue) {
		if (typeof(obj[prop]) !== type) {
			obj[prop] = defaultValue;
		}
	}
	
	function ensureOnEventArea(obj) {
		ensureDefinition('onEventArea', 'function', obj, function() { return true; });
	}

	function ensureDefaultEvent(obj, eventName) {
		ensureDefinition(eventName, 'function', obj, function() { });
	}

	/* EXTERNAL INTERFACE */
	
	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe,
		removeAllSubscriptions: removeAllSubscriptions,
		onClickEnter: onClickEnter,
		onClickExit: onClickExit,
		onClickDrag: onClickDrag,
		onKeyPress: onKeyPress,
		onKeyRelease: onKeyRelease,
		countSubscribers: countSubscribers
	};
	
});
