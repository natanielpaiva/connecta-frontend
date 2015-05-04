define([
    'connecta.portal',
    'bower_components/toastr/toastr.min'
], function (portal, toastr) {
    return portal.lazy.factory("notify", function () {
        toastr.options = {
            "closeButton": true,
            "debug": false,
            "positionClass": "toast-top-right",
            "onclick": null,
            "showDuration": "300",
            "hideDuration": "1000",
            "timeOut": "2000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        };

        return {
            success: function (text) {
                toastr.success(text);
            },
            error: function (text) {
                toastr.error(text, "Error");
            },
            info: function (text) {
                toastr.info(text);
            },
            warning: function(text){
                toastr.warning(text);
            }
        };
    });
});