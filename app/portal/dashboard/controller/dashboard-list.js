/* global angular */
define([
    'connecta.portal',
    'portal/layout/service/layout',
    'portal/dashboard/service/dashboard-service',
    'portal/layout/service/confirm'
], function (portal) {
    return portal.lazy.controller('DashboardListController', function ($scope, DashboardService, $confirm) {
        $scope.dashboards = [];

        $scope.listview = {
            mode: 'grid'
        };

        $scope.searchParams = {
            count: 50,
            page: 1
        };

        DashboardService.list($scope.searchParams).then(function (response) {
            $scope.dashboards = response.data.content;
        });
        
        $scope.bulkRemove = function (dashboard) {
            $confirm('DASHBOARD.CONFIRM_BULK_DELETE','DASHBOARD.BULK_DELETE_CONFIRM').then(function(){
                DashboardService.bulkRemove(dashboard).then(function(){
                    angular.forEach(dashboard, function(dashboard){
                        $scope.dashboards.splice(
                            $scope.dashboards.indexOf(dashboard), 1);
                    });
                });
                
            });
        };
    });
});
