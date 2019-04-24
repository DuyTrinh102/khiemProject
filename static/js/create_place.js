(function ($) {
    $(document).ready(function () {
        var form = '<form action="" method="post">\n' +
            '<label>Place code:</label>\n' +
            '<input id="place_code" name="place_code" type="text">\n' +
            '<label>Name:</label>\n' +
            '<input id="name" name="name" type="text">\n' +
            '<label>Address:</label>\n' +
            '<input id="address" name="address" type="text">\n' +
            '</form>';
        var form2 = '<form action="" method="post" id="test">\n' +
            '<label>Serial:</label>\n' +
            '<input id="serial" name="serial" type="text">\n' +
            '<label>Name:</label>\n' +
            '<input id="name2" name="name" type="text">\n' +
            '<label>Unit:</label>\n' +
            // '<input id="unit" name="unit" type="text">\n' +
            '<select id="unit" name="unit">\n' +
            '<option value="m3">lít/h</option>\n' +
            '<option value="pbm">pbm (TDS)</option>\n' +
            '<option value="NTU">NTU</option>\n' +
            '</select>\n' +
            '</form>';
        $('#dialog-form').html(form).dialog({
            modal: true,
            autoOpen: false,
            closeOnEscape: true,
            dialogClass: "no-close",
            resizable: false,
            draggable: false,
            width: 600,
            buttons: [
                {
                    text: 'Save',
                    click: function (event) {
                        var place_code = $("#place_code").val();
                        var address = $("#address").val();
                        var name = $("#name").val();
                        if (place_code === '' || address === '' || name === '') {
                            alert("Please fill all fields...!!!!!!");
                            event.preventDefault();
                        }
                        else {
                            $.fn.csrfSafeMethod = function (method) {
                                // these HTTP methods do not require CSRF protection
                                return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
                            };

                            $.ajaxSetup({
                                beforeSend: function (xhr, settings) {
                                    if (!$.fn.csrfSafeMethod(settings.type) && !this.crossDomain) {
                                        var csrftoken = $('input[name="csrfmiddlewaretoken"]').val();
                                        xhr.setRequestHeader('X-CSRFToken', csrftoken);
                                    }
                                }
                            });
                            $.ajax({
                                'type': 'POST',
                                'url': $('.create-place').attr('data-url'),
                                'data': {
                                    place_code: place_code,
                                    name: name,
                                    address: address
                                },
                                'success': function (result) {
                                    if (result.result) {
                                        alert(result.message);
                                        location.reload();
                                    }
                                    else {
                                        alert(result.message);
                                    }
                                },
                            });
                            $(this).dialog("close");
                        }
                    }
                },
                {
                    text: "Close",
                    click: function () {
                        $(this).dialog("close");
                    }
                }
            ]
        });

        $('.create-place').on('click', function () {
            $('#dialog-form').dialog("open");
        });
        $('.add-device').on('click', function () {
            var place_id = $(this).attr('id');
            $('#dialog-form2').html(form2).dialog({
                modal: true,
                closeOnEscape: false,
                dialogClass: "no-close",
                resizable: false,
                draggable: false,
                width: 600,
                buttons: [
                    {
                        text: 'Save',
                        click: function (event) {
                            var unit = $("#unit").val();
                            var name = $("#name2").val();
                            var serial = $("#serial").val();
                            if (unit === '' || name === '') {
                                alert("Please fill all fields...!!!!!!");
                                event.preventDefault();
                            }
                            else {
                                $.fn.csrfSafeMethod = function (method) {
                                    // these HTTP methods do not require CSRF protection
                                    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
                                };

                                $.ajaxSetup({
                                    beforeSend: function (xhr, settings) {
                                        if (!$.fn.csrfSafeMethod(settings.type) && !this.crossDomain) {
                                            var csrftoken = $('input[name="csrfmiddlewaretoken"]').val();
                                            xhr.setRequestHeader('X-CSRFToken', csrftoken);
                                        }
                                    }
                                });
                                $.ajax({
                                    'type': 'POST',
                                    'url': $('.add-device').attr('data-url'),
                                    'data': {
                                        serial: serial,
                                        name: name,
                                        unit: unit,
                                        place_id: place_id
                                    },
                                    'success': function (result) {
                                        if (result.result) {
                                            alert(result.message);
                                        }
                                        else {
                                            alert(result.message);
                                        }
                                    },
                                });
                                $(this).dialog("close");
                                location.reload();
                            }
                        }
                    },
                    {
                        text: "Close",
                        click: function () {
                            $(this).dialog("close");
                        }
                    }
                ]
            });
        });

        $('.control-load').on('change', function () {
                var place_id = $(this).attr('id');
                var place_code = $(this).attr('data-place-code');
                $.fn.csrfSafeMethod = function (method) {
                    // these HTTP methods do not require CSRF protection
                    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
                };

                $.ajaxSetup({
                    beforeSend: function (xhr, settings) {
                        if (!$.fn.csrfSafeMethod(settings.type) && !this.crossDomain) {
                            var csrftoken = $('input[name="csrfmiddlewaretoken"]').val();
                            xhr.setRequestHeader('X-CSRFToken', csrftoken);
                        }
                    }
                });
                $.ajax({
                    'type': 'POST',
                    'url': $('.control-load').attr('data-url'),
                    'data': {
                        place_id: place_id,
                        place_code: place_code,
                        is_checked: $(this).is(":checked")
                    },
                    'success': function (result) {
                        if (result.result){
                            // alert(result.message);
                            if (result.status){
                                location.reload();
                            }

                            console.log(result.isPub);
                            console.log('----');
                            if (result.isPub){
                                var host = 'broker.hivemq.com';
                                var port = 8000;
                                var topic = 'publishTopic';
                                var value = result.message;
                                $('#content-body').attr('style', 'filter: blur(10px');
                                $('#loader').attr('style','display: block');
                                __init__(host, port, topic, value);
                            }

                        }
                        else {
                            alert(result.message);
                        }
                    },
                });

        });
        // Control place
        $('.delete-device').on('click', function () {
            var device_id = $(this).attr('id');
            $('#dialog-form4').html('Bạn có muốn xóa thiết bị này?').dialog({
                modal: true,
                closeOnEscape: false,
                dialogClass: "no-close",
                resizable: false,
                draggable: false,
                width: 600,
                buttons: [
                    {
                        text: 'Save',
                        click: function (event) {
                            $.fn.csrfSafeMethod = function (method) {
                                // these HTTP methods do not require CSRF protection
                                return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
                            };

                            $.ajaxSetup({
                                beforeSend: function (xhr, settings) {
                                    if (!$.fn.csrfSafeMethod(settings.type) && !this.crossDomain) {
                                        var csrftoken = $('input[name="csrfmiddlewaretoken"]').val();
                                        xhr.setRequestHeader('X-CSRFToken', csrftoken);
                                    }
                                }
                            });
                            $.ajax({
                                'type': 'POST',
                                'url': $('.delete-device').attr('data-url'),
                                'data': {
                                    device_id: device_id
                                },
                                'success': function (result) {
                                    if (result.result) {
                                        alert(result.message);
                                    }
                                    else {
                                        alert(result.message);
                                    }
                                },
                            });
                            $(this).dialog("close");
                            location.reload();
                        }
                    },
                    {
                        text: "Close",
                        click: function () {
                            $(this).dialog("close");
                        }
                    }
                ]
            });
        });
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
	function __init__(host, port, topic, value) {
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
					client.send(topic, value);
				},
				onFailure: doFail
			};
			client.onConnectionLost = onConnectionLost;
			client.onMessageArrived = onMessageArrived;
			client.connect(options);
			$('#content-body').attr('style', 'filter: none');
			$('#loader').attr('style','display: none');
		} catch (e) {
			setTimeout(function () {
				__init__(host, port, topic);
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

	}

	// Connect failed
	function doFail(message) {
		console.log("Fail1");
		$('#content-body').attr('style', 'filter: blur(10px');
		$('#content-body').attr('disabled', true);
		$('#loader').attr('style','display: block');
		setTimeout(function () {
				__init__(host, port, topic);
			}, 1000);
	}

	function isMobile() {

        if (sessionStorage.desktop) // desktop storage
            return false;
        else if (localStorage.mobile) // mobile storage
            return true;

        // alternative
        var mobile = ['iphone','ipad','android','blackberry','nokia','opera mini','windows mobile','windows phone','iemobile'];
        for (var i in mobile) if (navigator.userAgent.toLowerCase().indexOf(mobile[i].toLowerCase()) > 0) return true;

        // nothing found.. assume desktop
        return false;
}

})(jQuery);