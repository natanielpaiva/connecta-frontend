/* global angular */
define([
    'connecta.portal',
    'portal/layout/service/layout',
    'portal/dashboard/service/dashboard-service'
], function (portal) {
    return portal.lazy.controller('DashboardListController', function ($scope, DashboardService, LayoutService) {
        $scope.dashboards = [];
        
//        LayoutService.showHeading(false);
//        $scope.$on("$locationChangeStart", function () {
//            LayoutService.showHeading(true);
//        });

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
            DashboardService.bulkRemove(dashboard).then(function(){
                angular.forEach(dashboard, function(dashboard){
                    $scope.dashboards.splice(
                        $scope.dashboards.indexOf(dashboard), 1);
                });
            });
        };
    });
});
