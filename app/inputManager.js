define([], function() {

	var subscribers = [];	

	function subscribe(obj) {
		var sub = { obj: obj };
		sub.callbacks = [];
		ensureProperties(sub, obj);
		subscribers.push(sub);

		return sub;
	}

	function unsubscribe(sub) {
		var index = subscribers.indexOf(sub);
		if (index > -1) {
			subscribers.splice(index, 1);
		}
	}

	function registerCallback(sub, eventName, callback) {
		sub[eventName] = callback;
	}

	function removeAllSubscriptions() {
		subscribers.length = 0;
	}

	function fireEvent(eventName, event) {
		onEvent(eventName, event);
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

	function onKeyEnter(event) {
		onEvent('onKeyEnter', event);
	}

	function onKeyExit(event) {
		onEvent('onKeyExit', event);
	}

	function countSubscribers() {
		return subscribers.length;
	}

	function setEventArea(sub, callback) {
		sub.onEventArea = callback;
	}

	/* HELPERS */

	function onEvent(eventName, event) {
		subscribers.forEach(function(s) {
			if (s.onEventArea(event)) {
				s[eventName](event);
			}
		});
	}

	function ensureProperties(sub, obj) {
		ensureOnEventArea(sub, obj);
		ensureDefaultEvent(sub, obj, 'onClickEnter');
		ensureDefaultEvent(sub, obj, 'onClickExit');
		ensureDefaultEvent(sub, obj, 'onClickDrag');
		ensureDefaultEvent(sub, obj, 'onKeyEnter');
		ensureDefaultEvent(sub, obj, 'onKeyExit');
	}
	
	function ensureDefinition(prop, type, sub, obj, defaultValue) {
		if (typeof(obj[prop]) !== type) {
			sub[prop] = defaultValue;
		} else {
			sub[prop] = obj[prop];
		}
	}
	
	function ensureOnEventArea(sub, obj) {
		ensureDefinition('onEventArea', 'function', sub, obj, function() { return true; });
	}

	function ensureDefaultEvent(sub, obj, eventName) {
		ensureDefinition(eventName, 'function', sub, obj, function() { });
	}

	/* EXTERNAL INTERFACE */
	
	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe,
		registerCallback: registerCallback,
		setEventArea: setEventArea,
		removeAllSubscriptions: removeAllSubscriptions,
		onClickEnter: onClickEnter,
		onClickExit: onClickExit,
		onClickDrag: onClickDrag,
		onKeyEnter: onKeyEnter,
		onKeyExit: onKeyExit,
		countSubscribers: countSubscribers
	};
	
});
