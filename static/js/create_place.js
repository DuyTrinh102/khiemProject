(function ($) {
    $(document).ready(function () {
        var form = '<form action="" method="post">\n' +
            '<label>Name:</label>\n' +
            '<input id="name" name="name" type="text">\n' +
            '<label>Address:</label>\n' +
            '<input id="address" name="address" type="text">\n' +
            '</form>';
        var form2 = '<form action="" method="post">\n' +
            '<label>Serial:</label>\n' +
            '<input id="serial" name="serial" type="text">\n' +
            '<label>Name:</label>\n' +
            '<input id="name2" name="name" type="text">\n' +
            '<label>Unit:</label>\n' +
            '<input id="unit" name="unit" type="text">\n' +
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
                },
                {
                    text: "Close",
                    click: function () {
                        $(this).dialog("close");
                    }
                }
            ]
        });
        $('#dialog-form2').html(form2).dialog({
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
                        var unit = $("#unit").val();
                        var name = $("#name2").val();
                        var serial = $("#serial").val();
                        if (unit === '' || name === '') {
                            alert("Please fill all fields...!!!!!!");
                            event.preventDefault();
                        }
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
                                place_id: $('.add-device').attr('data-place-id')
                            },
                            'success': function (result) {
                                console.log(result.result);
                                if (result.result) {
                                    alert(result.message);
                                    location.reload();
                                }
                                else {
                                    console.log(result.message);
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
        $('.create-place').on('click', function () {
            $('#dialog-form').dialog("open");
        });
        $('.add-device').on('click', function () {
            console.log("hehe");
            $('#dialog-form2').dialog("open");
        });
    });
})(jQuery);