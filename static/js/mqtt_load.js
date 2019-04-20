(function ($) {
	'use strict';

	$(document).ready(function () {
		try {
			var host = 'broker.hivemq.com';
			var port = 8000;
			var topic = 'publishTopic';
			__init__(host, port, topic);
		} catch (e) {
		}
	});

	function uuid(type) {
		function s4() {
			return Math.floor((1 + Math.random()) * 0x10000)
				.toString(16)
				.substring(1);
		}

		switch (type) {
			case 'hex':
				return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
			case 'normal':
				return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
		}
	}


	// called when the client connects
	function __init__(host, port, topic) {
		// Once a connection has been made, make a subscription and send a message.
		var tmp_timeout;
		try {
			if (tmp_timeout) {
				clearTimeout(tmp_timeout);
			}
			var clientID = uuid('hex');
			var client = new Paho.MQTT.Client(host, Number(port), clientID);
			var options = {
				useSSL: false,
				timeout: 60,
				// userName: 'tnuxyfho',
				// password: 'XRr8MM9m5Hbt',
				cleanSession: true,
				onSuccess: function () {
					client.subscribe(topic);
				},
				onFailure: doFail
			};
			client.onConnectionLost = onConnectionLost;
			client.onMessageArrived = onMessageArrived;
			client.connect(options);
		} catch (e) {
			setTimeout(function () {
				__init__(host, port);
			}, 10000);
		}
	}

	// called when the client loses its connection
	function onConnectionLost(responseObject) {
		if (responseObject.errorCode !== 0) {
			console.log('onConnectionLost:' + responseObject.errorMessage);
		}
	}

	// called when a message arrives
	function onMessageArrived(message) {
		var data = message.payloadString;
		// console.log(data);
		var data_list = data.split("-")

		if (data_list[2] === "a"){
			$('#' + data_list[0] + "-" + data_list[1]).prop('checked', true);
			// console.log('checked-a');
		} else {
			$('#' + data_list[0] + "-" + data_list[1]).prop('checked', false);
			// console.log('checked-b');
		}

	}

	// Connect failed
	function doFail(message) {
		location.reload();
	}
})(jQuery);
