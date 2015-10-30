define([
    'connecta.portal'
], function (portal) {
    return portal.directive('fileModel', function ($parse, $timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.on('change', function () {
                    if (element[0].files[0]) {
                        $timeout(function () {
                            $parse(attrs.fileModel).assign(scope, element[0].files[0]);
                        });
                    }
                });
            }
        };
    });
});