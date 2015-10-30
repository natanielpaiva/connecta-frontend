/* global angular */

define([
    'connecta.portal'
], function (portal) {

    return portal.filter('dataUri', function ($timeout) {
        return function (file) {
            if (angular.isString(file)) {
                return file;
            } else {
                if (!file.base64 && !file.loading) {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        $timeout(function () {
                            file.base64 = e.target.result;
                            file.loading = false;
                        });
                    };
                    reader.readAsDataURL(file);
                    file.loading = true;
                }

                return file.base64;
            }
        };
    });

});