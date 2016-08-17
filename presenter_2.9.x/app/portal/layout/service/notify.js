define([
    'connecta.portal',
    'bower_components/toastr/toastr.min'
], function (portal, toastr) {
    return portal.service('notify', function ($translate, $rootScope) {
        toastr.options = {
            closeButton: true,
            debug: false,
            positionClass: 'toast-top-right',
            onclick: null,
            showDuration: 300,
            hideDuration: 1000,
            timeOut: 3000,
            extendedTimeOut: 1000,
            showEasing: 'swing',
            hideEasing: 'linear',
            showMethod: 'fadeIn',
            hideMethod: 'fadeOut'
        };

        var _backendMessageTypeMap = {
            SUCCESS: 'success',
            INFO: 'info',
            WARN: 'warning',
            ERROR: 'error'
        };

        this.success = function (text) {
            $translate(text).then(function (translate) {
                toastr.success(translate);
            });
        };
        this.info = function (text) {
            $translate(text).then(function (translate) {
                toastr.info(translate);
            });
        };
        this.warning = function (text) {
            $translate(text).then(function (translate) {
                toastr.warning(translate);
            });
        };
        this.error = function (text) {
            $translate(text).then(function (translate) {
                toastr.error(translate);
            });
        };
        
        var notify = this;

        $rootScope.$on('layout.notify', function (event, message) {
            var method = _backendMessageTypeMap[message.type];
            notify[ method ]( message.message );
        });
    });
});