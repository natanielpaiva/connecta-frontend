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
            toastr.success($translate.instant(text));
        };
        this.info = function (text) {
            toastr.info($translate.instant(text));
        };
        this.warning = function (text) {
            toastr.warning($translate.instant(text));
        };
        this.error = function (text) {
            toastr.error($translate.instant(text));
        };
        
        var notify = this;

        $rootScope.$on('layout.notify', function (event, message) {
            var method = _backendMessageTypeMap[message.type];
            notify[ method ]( message.message );
        });
    });
});