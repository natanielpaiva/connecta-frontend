define([
    'connecta.portal',
    'bower_components/toastr/toastr.min'
], function (portal, toastr) {
    return portal.factory("notify", function ($translate) {
        toastr.options = {
            "closeButton": true,
            "debug": false,
            "positionClass": "toast-top-right",
            "onclick": null,
            "showDuration": "300",
            "hideDuration": "1000",
            "timeOut": "3000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        };

        return {
            success: function (text) {
                $translate(text).then(function (translate) {
                    toastr.success(translate);
                });
            },
            error: function (text) {
                $translate(text).then(function (translate) {
                    toastr.error(translate, "Error");
                });
            },
            info: function (text) {
                $translate(text).then(function (translate) {
                    toastr.info(translate);
                });
            },
            warning: function(text){
                $translate(text).then(function (translate) {
                    toastr.warning(translate);
                });
            }
        };
    });
});