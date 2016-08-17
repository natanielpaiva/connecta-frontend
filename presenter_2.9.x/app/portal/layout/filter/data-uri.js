/* global angular */
define([
    'connecta.portal',
    'portal/layout/service/data-uri'
], function (portal) {
    return portal.filter('dataUri', function (dataURI) {
        return function (file) {
            dataURI(file).then(function(string){
                file.base64 = string;
            });
            return file && file.base64 ? file.base64 : null;
        };
    });
});