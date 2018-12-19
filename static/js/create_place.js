(function ($) {
    $(document).ready(function () {
        var form = '<form action="" method="post">\n' +
            '<label>Name:</label>\n' +
            '<input id="name" name="name" type="text">\n' +
            '<label>Address:</label>\n' +
            '<input id="address" name="address" type="text">\n' +
            '</form>'
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
                        console.log("test");
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
                                console.log(result.result);
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
        $('.create-place').on('click', function () {
            $('#dialog-form').dialog("open");
        });
    });
})(jQuery);