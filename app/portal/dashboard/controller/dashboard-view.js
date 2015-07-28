define([
  'connecta.portal',
  'portal/dashboard/service/dashboard-service',
  'portal/layout/service/layout'
], function(portal) {
  return portal.lazy.controller('DashboardViewController', function($scope, DashboardService, $routeParams, layoutService, $location) {
    $scope.dashboard = {};

    layoutService.setFullscreen(true);

    $scope.$on("$locationChangeStart", function(event) {
      layoutService.setFullscreen(false);
    });

    $scope.gridsterItemConfig = {
      sizeX: 'item.sizeX',
      sizeY: 'item.sizeY',
      row: 'item.row',
      col: 'item.column'
    };

    DashboardService.get($routeParams.id).then(function(response) {
      angular.forEach(response.data.sections, function(section) {
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
  });
});
