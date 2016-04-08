define([
    'connecta.portal'
], function (portal) {
    return portal.directive('validatedFieldMessages', function () {
        return {
            restrict: 'E',
            templateUrl: 'app/portal/layout/directive/template/validated-field-messages.html',
            scope: {
                ngModel:'='
            }
        };
    });
});
