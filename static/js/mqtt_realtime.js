(function ($) {
	'use strict';

	$(document).ready(function () {
		try {
			var host = 'broker.hivemq.com';
			var port = 8000;
			var topic = 'subscribeTopic';
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
				onFailure: function () {
					doFail(host, port, topic)
				}
			};
			client.onConnectionLost = onConnectionLost;
			client.onMessageArrived = onMessageArrived;
			client.connect(options);
			$('#content-body').attr('style', 'filter: none');
			$('#loader').attr('style','display: none');
		} catch (e) {
			console.log(e);
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
		var data = JSON.parse(message.payloadString);
		var type = data['type'];
		var value = data['value'];

		if (type === 1){
			$('#' + data['serial']).val(value);
		} else {
			if (value === 1) {
				$('#' + data['serial']).attr('src', '/static/images/warningBg.png');
			} else {
				$('#' + data['serial']).attr('src', '/static/images/yesBg.png');
			}
		}

	}

	// Connect failed
	function doFail(host, port, topic) {
		console.log("Fail2");
		$('#content-body').attr('style', 'filter: blur(10px');
		$('#content-body').attr('disabled', true);
		$('#loader').attr('style','display: block');
		setTimeout(function () {
				__init__(host, port, topic);
			}, 1000);
	}
})(jQuery);
