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
            '<option value="m3">M3</option>\n' +
            '<option value="tds">TDS</option>\n' +
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
                        var address = $("#address").val();
                        var name = $("#name").val();
                        if (address === '' || name === '') {
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

        // Control place
        $('.control-place').on('click', function () {
            var place_id = $(this).attr('id');
            $('#dialog-form3').html('Bạn có muốn tắt nước cho nhóm thiết bị này?').dialog({
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
                                'url': $('.control-place').attr('data-url'),
                                'data': {
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
})(jQuery);