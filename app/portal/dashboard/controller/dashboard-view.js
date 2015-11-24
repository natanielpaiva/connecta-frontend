/* global angular */
define([
    'connecta.portal',
    'portal/dashboard/service/dashboard-service',
    'portal/layout/service/layout',
    'portal/dashboard/directive/viewer',
    'presenter/viewer/directive/analysis-viewer',
    'presenter/viewer/directive/singlesource-viewer',
    'presenter/viewer/directive/singlesource-group-viewer',
    'presenter/viewer/directive/combined-viewer',
    'maps/layer-viewer/directive/map-viewer'
], function (portal) {
    return portal.lazy.controller('DashboardViewController', function ($scope, DashboardService, $routeParams, LayoutService, $location, $filter) {
        $scope.dashboard = {};

        LayoutService.setFullscreen(true);

        $scope.$on("$locationChangeStart", function(){
            LayoutService.setFullscreen(false);
        });

        $scope.gridsterItemConfig = {
            sizeX: 'item.sizeX',
            sizeY: 'item.sizeY',
            row: 'item.row',
            col: 'item.column'
        };

        DashboardService.get($routeParams.id).then(function (response) {

            response.data.sections = $filter('orderBy')(response.data.sections, 'order');

            angular.forEach(response.data.sections, function (section) {
                section.config = {
                    draggable: {
                        enabled: false
                    },
                    resizable: {
                        enabled: false
                    }
                };
            });

            $scope.dashboard = response.data;
        });

        $scope.getImage = function (image) {
            if (image && angular.isString(image)) {
                return 'url(' + image + ')';
            } else if (image && image.base64) {
                return 'url(' + image.base64 + ')';
            } else {
                return 'none';
            }
        };
        
        $scope.toRGBA = function (hex, opacity) {
            if (!hex || hex.length < 7) {
                return 'transparent';
            }

            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

            if (!result) {
                return 'transparent';
            }

            var color = {
                red: parseInt(result[1], 16),
                green: parseInt(result[2], 16),
                blue: parseInt(result[3], 16)
            };

            return [
                'rgba(',
                color.red,
                ',',
                color.green,
                ',',
                color.blue,
                ',',
                opacity ? (opacity / 100) : 1,
                ')'
            ].join('');
        };
    });
});
