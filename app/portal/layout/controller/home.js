/* global angular */
require([
    'connecta.portal'
], function(portal) {
    return portal.controller('HomeController', function($scope, LayoutService, applications) {
        LayoutService.showAsFlat(true);

        $scope.options = {
            presenter: {
                '#/presenter/datasource/new': 'DATASOURCE.NEW_DATASOURCE',
                '#/presenter/analysis/new': 'ANALYSIS.NEW_ANALYSIS',
                '#/presenter/viewer/new/line/line-stacked': 'VIEWER.NEW_VIEWER'
            },
            maps: {
                '#/link1': 'DATASOURCE.NEW_DATASOURCE',
                '#/link2': 'DATASOURCE.NEW_DATASOURCE',
                '#/link3': 'DATASOURCE.NEW_DATASOURCE'
            }
            // TODO Continuar com ações padrão
        };

        function _mapToArray(map) {
            var array = [];
            angular.forEach(map, function(value, key) {
                value.id = key;
                array.push(value);
            });
            return array;
        }

        $scope.applications = _mapToArray(applications);

        $scope.shownModules = function(obj) {
            return (!obj.hide && obj.active && !obj.main);
        };

        $scope.unactiveModules = function(obj) {
            return (!obj.hide && !obj.active);
        };

        $scope.$on("$locationChangeStart", function() {
            LayoutService.showAsFlat(false);
        });
    });
});
