/* global angular */
define([
    'connecta.portal'
], function (portal) {
    return portal.lazy.filter('bullet', function() {
        return function (string, turnOff) {
            if (turnOff) {
                return string;
            }
            return new Array(string.length+1).join("•");
        };
    });
});