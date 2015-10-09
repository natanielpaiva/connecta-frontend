define([
    'connecta.portal'
], function (portal) {
    return portal.directive('typeSwitcher', function () {
        return {
            restrict: 'E',
            templateUrl: "app/portal/layout/directive/template/type-switcher.html",
            scope: {
                ngModel: '=ngModel',
                config:'='
            },
            controller: function ($scope, $log) {
                
            }
        };
    });
});