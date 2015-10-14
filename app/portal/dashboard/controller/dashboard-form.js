/* global angular */
define([
  'connecta.portal',
  'portal/layout/service/layout',
  'portal/dashboard/service/dashboard-service',
  'portal/dashboard/directive/viewer',
  'presenter/viewer/directive/analysis-viewer',
  'presenter/viewer/directive/singlesource-viewer',
  'presenter/viewer/directive/singlesource-group-viewer',
  'presenter/viewer/directive/combined-viewer'
], function(portal) {
  return portal.lazy.controller('DashboardFormController', function($scope, LayoutService, DashboardService, $routeParams, $location, $filter, SidebarService, applications) {
    $scope.dashboard = {};
    
    var _sectionTemplate = {
      name: $filter('translate')('DASHBOARD.NEW_SECTION'),
      items: [],
      active: true
    };

    LayoutService.showSidebarRight(true);
    SidebarService.config({
      controller: function ($scope) {
        $scope.applications = applications;
        
        $scope.search = {
          terms: "",
          results:[]
        };
        
        $scope.search.doSearch = function(){
          DashboardService.searchViewers($scope.search.terms).then(function(response){
            angular.forEach(response.data, function(obj){
              var viewerPath = applications[obj.module].host +
                      applications[obj.module].viewerPath;
              obj.viewerUrl = viewerPath.replace(':id', obj.id);
              delete obj.id;
            });
            
            $scope.search.results = response.data;
          });
        };
        
        $scope.$watch('search.terms', function(){
          $scope.search.doSearch();
        });
        
      },
      src: 'app/portal/dashboard/template/_dashboard-form-viewer-search.html'
    });

    $scope.$on('$locationChangeStart', function() {
      LayoutService.showSidebarRight(false);
      SidebarService.config({
        controller: function(){}
      });
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
        ],
        displayMode:'VERTICAL'
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
    
    $scope.renameSection = function($event, section, edit) {
      $event.preventDefault();
      section.edit = edit;
    };

    $scope.removeSection = function($event, section) {
      $event.preventDefault();
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
