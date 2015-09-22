/* global angular */
define([
  'connecta.portal',
  'portal/layout/service/layout',
  'portal/dashboard/service/dashboard-service'
], function(portal) {
  return portal.lazy.controller('DashboardFormController', function($scope, LayoutService, DashboardService, $routeParams, $location, $filter) {
    $scope.dashboard = {};
    
    var _sectionTemplate = {
      name: $filter('translate')('DASHBOARD.NEW_SECTION'),
      items: [],
      active: true
    };

    LayoutService.showSidebarRight(true);

    $scope.$on('$locationChangeStart', function() {
      LayoutService.showSidebarRight(false);
    });

    if ($routeParams.id) {
      DashboardService.get($routeParams.id).then(function(response) {
        response.data.sections.sort(function(a, b) {
          return a.order - b.order;
        });
        response.data.sections[0].active = true;

        $scope.dashboard = response.data;
      });
    } else {
      var section = angular.copy(_sectionTemplate);
      section.order = 0;
      $scope.dashboard = {
        sections: [
          section
        ]
      };
    }

    $scope.config = {
      draggable: {
        enabled: true
      },
      resizable: {
        enabled: true
      }
    };

    /**
     * Configuração dos itens do gridster de todas as seções
     */
    $scope.gridsterItemConfig = {
      sizeX: 'item.sizeX',
      sizeY: 'item.sizeY',
      row: 'item.row',
      col: 'item.column'
    };

    $scope.addSection = function() {
      if ($scope.dashboard.sections) {
        var section = angular.copy(_sectionTemplate);
        section.order = $scope.dashboard.sections.length;
        $scope.dashboard.sections.push(section);
      }
    };

    $scope.removeSection = function(section) {
      $scope.dashboard.sections.splice(
        $scope.dashboard.sections.indexOf(section), 1
      );
    };

    $scope.remove = function(item) {
      $scope.items.splice($scope.items.indexOf(item), 1);
    };

    $scope.add = function() {
      $scope.items.push({
        sizeX: 2,
        sizeY: 1,
        row: 0,
        col: 0
      });
    };

    $scope.save = function() {
      DashboardService.save($scope.dashboard).then(function(response) {
        $location.path('dashboard/' + response.data.id);
      });
    };
  });
});
