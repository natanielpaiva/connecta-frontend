/* global angular */
define([
    'connecta.portal',
    'json!applications.json',
    'portal/dashboard/service/dashboard-service',
    'portal/layout/service/layout',
    'portal/dashboard/directive/viewer',
    'presenter/viewer/directive/analysis-viewer',
    'presenter/viewer/directive/twitter-timeline-viewer',
    'presenter/viewer/directive/singlesource-viewer',
    'presenter/viewer/directive/singlesource-group-viewer',
    'presenter/viewer/directive/combined-viewer',
    'maps/layer-viewer/directive/map-viewer'
], function (portal, applications) {
    return portal.lazy.controller('DashboardViewController', function ($scope, DashboardService, $routeParams, LayoutService, $filter, $document, $window, $timeout, applications) {
        $scope.config = {
            headerMini: false,
            isPrinting: false,
            isBrowserOnFullscreen: false
        };
        
        $scope.logoCustom = applications.portal.theme.image.dashboard;

        $document.on('scroll', function () {
            $scope.config.headerMini = $document.scrollTop() > 1;
            $scope.$apply();
        });

        $scope.dashboard = {
            hasExpandedViewer: false
        };

        $scope.$on('dashboard.hasExpanded', function($event, hasExpanded){
            $scope.dashboard.hasExpandedViewer = hasExpanded;
        });

        LayoutService.setFullscreen(true);

        $scope.$on("$locationChangeStart", function () {
            LayoutService.setFullscreen(false);
        });

        $scope.gridsterItemConfig = {
            sizeX: 'item.sizeX',
            sizeY: 'item.sizeY',
            row: 'item.row',
            col: 'item.column'
        };


        $scope.fullscreen = function () {
            LayoutService.toggleBrowserFullscreen();

            $scope.config.isBrowserOnFullscreen = LayoutService.isBrowserOnFullscreen();
        };

        $scope.export = function () {
            // TODO
        };

        $scope.print = function () {
            $scope.config.isPrinting = true;

            $timeout(function(){
                $scope.$apply(function(){
                    $window.print();
                    $scope.config.isPrinting = false;
                });
            },2000);
        };


        DashboardService.get($routeParams.id).then(function (response) {

            response.data.sections = $filter('orderBy')(response.data.sections, 'order');

            angular.forEach(response.data.sections, function (section) {
                section.config = {
                    columns: 12,
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
