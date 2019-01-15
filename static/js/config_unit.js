(function ($) {
    $(document).ready(function () {
        var form = '<form action="" method="post">\n' +
            '<label>Đơn giá:</label>\n' +
            '<input id="unit_price" name="unit_price" type="text">\n'
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
                        var unit_price = $("#unit_price").val();
                        if (unit_price === '') {
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
                                'url': $('.config-price').attr('data-url'),
                                'data': {
                                    value: unit_price,
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
        $('.config-price').on('click', function () {
            $('#dialog-form').dialog("open");
        });
    });
})(jQuery);