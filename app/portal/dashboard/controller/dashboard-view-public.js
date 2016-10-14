/* global angular */
define([
    'connecta.portal',
    'portal/dashboard/service/dashboard-service-public',
    'portal/layout/service/layout',
    'portal/dashboard/directive/viewer',
    'presenter/viewer/directive/analysis-viewer',
    'presenter/viewer/directive/singlesource-viewer',
    'presenter/viewer/directive/singlesource-group-viewer',
    'presenter/viewer/directive/combined-viewer',
    'maps/layer-viewer/directive/map-viewer'
], function (portal) {
    return portal.lazy.controller('PublicDashboardViewController', function ($scope, $rootScope, PublicDashboardService, $routeParams, LayoutService, $filter, $document, $window, $timeout, applications) {
        $scope.config = {
            headerMini: false,
            isPrinting: false
        };

        $document.on('scroll', function () {
            $scope.config.headerMini = $document.scrollTop() > 70;
            $scope.$apply();
        });

        $scope.dashboard = {};

        LayoutService.setFullscreen(true);
        LayoutService.showHeading(false);

        $scope.$on("$locationChangeStart", function () {
            LayoutService.setFullscreen(false);
            LayoutService.showHeading(true);
        });

        $scope.gridsterItemConfig = {
            sizeX: 'item.sizeX',
            sizeY: 'item.sizeY',
            row: 'item.row',
            col: 'item.column'
        };

        $scope.fullscreen = function () {
            LayoutService.toggleBrowserFullscreen();
        };

        $scope.export = function () {
            // TODO
        };

        $scope.print = function () {
            $scope.config.isPrinting = true;

//            $timeout(function(){
//                $scope.$apply(function(){
//                    $window.print();
//                    $scope.config.isPrinting = false;
//                });
//            },2000);
        };

        PublicDashboardService.getPublic($routeParams.id).then(function (response) {

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
//                return '#f9f9f9';
                return false;
            }

            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

            if (!result) {
                return false;
//                return '#f9f9f9';
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