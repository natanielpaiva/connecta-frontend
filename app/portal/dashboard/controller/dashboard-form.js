define([
  'connecta.portal',
  'portal/dashboard/service/dashboard-service'
], function (portal) {
  return portal.lazy.controller('DashboardFormController', function ($scope, layoutService, DashboardService, $routeParams, $translate, $location) {
    $scope.dashboard = {};
    
    layoutService.showSidebarRight(true);
    
    $scope.$on('$locationChangeStart', function(){
        layoutService.showSidebarRight(false);
    });

    if ($routeParams.id) {
      DashboardService.get($routeParams.id).then(function(response){
        response.data.sections.sort(function(a, b){
          return a.order - b.order;
        });
        response.data.sections[0].active = true;

        $scope.dashboard = response.data;
      });
    }

    $scope.config = {
      draggable: {
        enabled:true
      },
      resizable: {
        enabled:true
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
        $translate('DASHBOARD.NEW_SECTION').then(function(translation) {
          var newSection = {
            name: translation,
            items: [],
            active: true,
            //order:$scope.dashboard.sections.length
          };
          $scope.dashboard.sections.push(newSection);
        });
      }
    };

    $scope.removeSection = function(section){

    };

    $scope.remove = function(item){
      $scope.items.splice($scope.items.indexOf(item), 1);
    };

    $scope.add = function(){
      $scope.items.push({
        sizeX: 2, sizeY: 1, row: 0, col: 0
      });
    };

    $scope.save = function() {
      DashboardService.save($scope.dashboard).then(function(response){
        $location.path('dashboard/'+response.data.id);
      });
    };
  });
});
