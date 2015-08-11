define([
  'connecta.portal',
  'portal/dashboard/service/dashboard-service'
], function(portal) {
  return portal.lazy.controller('DashboardListController', function($scope, DashboardService) {
    $scope.dashboards = [];

    $scope.listview = {
      mode:'grid'
    };

    $scope.searchParams = {
      count: 50,
      page: 1
    };
    
    DashboardService.list($scope.searchParams).then(function(response){
      $scope.dashboards = response.data.content;
    });
  });
});
