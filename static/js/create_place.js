(function ($) {
    $(document).ready(function () {
        var form = '<form action="" method="post">\n' +
            '<label>Mã trạm:</label>\n' +
            '<input id="place_code" name="place_code" type="text">\n' +
            '<label>Tên:</label>\n' +
            '<input id="name" name="name" type="text">\n' +
            '<label>Địa chỉ:</label>\n' +
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

        try {
            var host = 'postman.cloudmqtt.com';
            var port = 33475;
            var topic = 'publishTopic';
            $('#content-body').attr('style', 'filter: blur(10px');
            $('#loader').attr('style', 'display: block');
            var clientID = uuid('hex');
            var client = new Paho.MQTT.Client(host, Number(port), clientID);
            __init__(host, port, topic, client);
        } catch (e) {
            console.log(e);
            $('#content-body').attr('style', 'filter: blur(10px');
            $('#loader').attr('style', 'display: block');
        }

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
                    text: 'Lưu',
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
                    text: "Đóng",
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
                        text: 'Lưu',
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
                        text: "Đóng",
                        click: function () {
                            $(this).dialog("close");
                        }
                    }
                ]
            });
        });

        $('#auth-form').dialog({
            modal: true,
            autoOpen: false,
            closeOnEscape: true,
            dialogClass: "no-close",
            resizable: false,
            draggable: false,
            width: 600,
            buttons: [
                {
                    text: 'Gửi',
                    click: function (event) {
                        var password = $("#password").val();
                        var place_id = $('.authentication').attr('id');
                        var place_code = $('.authentication').attr('data-place-code');
                        if (password === '') {
                            alert("Điền mật khẩu để tiếp tục...!!!!!!");
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
                                'url': $('.authentication').attr('data-url'),
                                'data': {
                                    password: password,
                                    place_id: place_id,
                                    place_code: place_code,
                                },
                                'success': function (result) {
                                    if (result.result) {
                                        alert('Đã gửi thành công!');
                                        document.forms['form_auth'].reset();
                                        if (result.status) {
                                            location.reload();
                                        }

                                        console.log(result.isPub);
                                        console.log('----');
                                        if (result.isPub) {
                                            var value = result.message;
                                            client.send(topic, value);
                                        }

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
                    text: "Đóng",
                    click: function () {
                        $(this).dialog("close");
                    }
                }
            ]
        });
        $('.authentication').on('click', function () {
            $('#auth-form').dialog("open");
        });

        $('#change-auth-form').dialog({
            modal: true,
            autoOpen: false,
            closeOnEscape: true,
            dialogClass: "no-close",
            resizable: false,
            draggable: false,
            width: 600,
            buttons: [
                {
                    text: 'Lưu',
                    click: function (event) {
                        var ol_password = $("#ol-password").val();
                        var ne_password = $("#ne-password").val();
                        var re_password = $("#re-password").val();
                        var place_id = $('.change-authentication').attr('id');
                        if (ol_password.length !== 4 || ne_password.length !== 4 || re_password.length !== 4){
                            alert("Điền đầy đủ mật khẩu để tiếp tục...!!!!!!");
                            event.preventDefault();
                        }
                        else if (ne_password !== re_password){
                            alert("Nhập lại mật khẩu phải khớp với mật khẩu mới...!!!!!!");
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
                                'url': $('.change-authentication').attr('data-url'),
                                'data': {
                                    old_password: ol_password,
                                    new_password: ne_password,
                                    load_info: place_id,
                                },
                                'success': function (result) {
                                    if (result.result) {
                                        alert('Đổi mật khẩu thành công!');
                                        document.forms['form_change_auth'].reset();
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
                    text: "Đóng",
                    click: function () {
                        $(this).dialog("close");
                    }
                }
            ]
        });
        $('.change-authentication').on('click', function () {
            $('#change-auth-form').dialog("open");
        });

        $('#auth-form').on('keypress', function (e) {
            return e.which !== 13;
        });

        $('.control-load').on('click', function () {
                var place_id = $(this).attr('id');
                var place_code = $(this).attr('data-place-code');
                var data_control = $(this).attr('data-control');
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
                        is_checked: data_control,
                        is_checked_sensor: $(this).is(":checked")
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
                                var value = result.message;
                                client.send(topic, value);
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
	function __init__(host, port, topic, client) {
		// Once a connection has been made, make a subscription and send a message.
		var tmp_timeout;
		try {
			if (tmp_timeout) {
				clearTimeout(tmp_timeout);
			}
			var options = {
				useSSL: true,
				timeout: 60,
				userName: 'nzwgvnhu',
				password: 'Vz8xYtwgE6E4',
				cleanSession: true,
				onSuccess: function () {
					// client.send(topic, value);
                    client.subscribe('subscribeTopic');
                    console.log('Connect successfully');
                    $('#content-body').attr('style', 'filter: none');
			        $('#loader').attr('style','display: none');
				},
				onFailure: function () {
					doFail(host, port, topic, value)
				}
			};
			client.onConnectionLost = onConnectionLost;
			client.onMessageArrived = onMessageArrived;
			client.connect(options);
		} catch (e) {
			setTimeout(function () {
				__init__(host, port, topic, client);
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
        console.log(data);
		try {
			data = JSON.parse(message.payloadString);
			var type = data['type'];
			var value = data['value'];

			if (type === 1){
				$('#' + data['serial']).val(value);
			} else {
				if (value === 0) {
					$('#' + data['serial']).attr('style', 'background-color: #d40c38; color: #FD7415;');
					$('#' + data['serial']).html('<strong>Warning!!!</strong> Có báo động!!!');
				} else {
					$('#' + data['serial']).attr('style', 'background-color: #49a844; color: #FD7415;');
					$('#' + data['serial']).html('<strong>Well!</strong> Khu vực của bạn an toàn');
				}
			}
		} catch (e) {
			var data_list = data.split("-");
			console.log(data_list);
			if (data_list.length === 3) {
				if (data_list[2] === "statusA") {
					var data_status = data_list[1].split(";");
					// console.log(data_status);
					var i;
					for (i = 0; i < data_status.length; i++) {
						var status = data_status[i].split(":");
						// console.log(data_list[0] + "-" + status[0] + '-statusA');
						if (status[1] === "a") {
							$('#' + data_list[0] + "-" + status[0] + '-statusA').attr('src', '/static/images/ledon-icon.jpg');
						} else {
							$('#' + data_list[0] + "-" + status[0] + '-statusA').attr('src', '/static/images/ledoff-icon.png');
						}
					}
				}
				else if (data_list[2] === "statusB") {
					var data_statusB = data_list[1].split(";");
					// console.log(data_status);
					var iB;
					for (iB = 0; iB < data_statusB.length; iB++) {
						var statusB = data_statusB[iB].split(":");
						// console.log(data_list[0] + "-" + status[0] + '-statusA');
						if (statusB[1] === "a") {
							$('#' + data_list[0] + "-" + statusB[0] + '-statusB').attr('src', '/static/images/2x/baseline_lock_open_white_48dp.png');
						} else {
							$('#' + data_list[0] + "-" + statusB[0] + '-statusB').attr('src', '/static/images/2x/baseline_lock_white_48dp.png');
						}
					}
				}
				else if (data_list[2] === "statusC") {
					var data_statusC = data_list[1].split(";");
					// console.log(data_status);
					var iC;
					for (iC = 0; iC < data_statusC.length; iC++) {
						var statusC = data_statusC[iC].split(":");
						// console.log(data_list[0] + "-" + status[0] + '-statusA');
						if (statusC[1] === "1") {
							$('#' + data_list[0] + "-" + statusC[0] + '-statusC').attr('style', 'width: 25%');
							$('#' + data_list[0] + "-" + statusC[0] + '-statusC').text('25%');
						}
						else if (statusC[1] === "2") {
						    $('#' + data_list[0] + "-" + statusC[0] + '-statusC').attr('style', 'width: 50%');
                            $('#' + data_list[0] + "-" + statusC[0] + '-statusC').text('50%');
                        }
						else if (statusC[1] === "3") {
						    $('#' + data_list[0] + "-" + statusC[0] + '-statusC').attr('style', 'width: 100%');
                            $('#' + data_list[0] + "-" + statusC[0] + '-statusC').text('100%');
                        }
						else {
                            $('#' + data_list[0] + "-" + statusC[0] + '-statusC').attr('style', 'width: 0; color: black;');
                            $('#' + data_list[0] + "-" + statusC[0] + '-statusC').text('Tắt');
						}
					}
				}
			}
		}
	}

	// Connect failed
	function doFail(host, port, topic, value) {
		console.log("Fail1");
		$('#content-body').attr('style', 'filter: blur(10px');
		$('#content-body').attr('disabled', true);
		$('#loader').attr('style','display: block');
		setTimeout(function () {
				__init__(host, port, topic, value);
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
