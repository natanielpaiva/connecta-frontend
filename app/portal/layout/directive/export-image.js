/* global angular, html2canvas */
define([
    'connecta.portal',
    'portal/layout/service/export-file'
], function (portal) {
    return portal.directive('exportImage', function (exportFile) {
        return {
            restrict: 'A',
            scope: {
                model: '=exportImage'
            },
            link: function (scope, element) {
                scope._element = element[0];
            },
            controller: function ($scope) {
                $scope.$watch('model', function (value) {
                    if (value && value.exportImage) {
                        return;
                    }
                    if (value && !value.exportImage) {
                        value.exportImage = function () {
                            exportFile.exportImage($scope.model, $scope._element);
                        };
                    }
                });
            }
        };
    });
});