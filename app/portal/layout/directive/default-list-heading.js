define([
    'connecta.portal'
], function (portal) {

    return portal.directive('defaultListHeading', function () {
        return {
            restrict: 'E',
            templateUrl: 'app/portal/layout/directive/template/default-list-heading.html',
            link: function (scope, element, attrs) {
                scope.listConfig = {
                    titleText: attrs.titleText,
                    addButtonText: attrs.addButtonText,
                    addButtonHref: attrs.addButtonHref
                };
            }
        };
    });
});
