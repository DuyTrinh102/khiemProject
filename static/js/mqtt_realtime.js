(function ($) {
	'use strict';

	$(document).ready(function () {
		try {
			var host = 'm16.cloudmqtt.com';
			var port = 39928;
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
			console.log(clientID);
			var client = new Paho.MQTT.Client(host, Number(port), clientID);
			var options = {
				useSSL: true,
				timeout: 60,
				userName: 'tnuxyfho',
				password: 'JrFzY67tUXXT',
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
		var data = message.payloadString;
		try {
			data = JSON.parse(message.payloadString);
			var type = data['type'];
			var value = data['value'];

			if (type === 1){
				$('#' + data['serial']).val(value);
			} else {
				if (value === 0) {
					$('#' + data['serial']).attr('src', '/static/images/warningBg.png');
				} else {
					$('#' + data['serial']).attr('src', '/static/images/yesBg.png');
				}
			}
		} catch (e) {
			var data_list = data.split("-");
			if (data_list.length === 3) {
				if (data_list[2] === "status") {
					var data_status = data_list[1].split(";");
					console.log(data_status);
					var i;
					for (i = 0; i < data_status.length; i++) {
						var status = data_status[i].split(":");
						if (status[1] === "a") {
							$('#' + data_list[0] + "-" + status[0] + '-status').attr('src', '/static/images/ledon-icon.jpg');
							console.log('AAAAAAAAAAa')
						} else {
							$('#' + data_list[0] + "-" + status[0] + '-status').attr('src', '/static/images/ledoff-icon.png');
						}
					}
				}
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
