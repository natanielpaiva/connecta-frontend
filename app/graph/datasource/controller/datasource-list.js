/* global angular */
define([
    'connecta.graph',
    'graph/datasource/service/datasource-service'
], function (graph) {
    return graph.lazy.controller('DatasourceListController', function ($scope, DatasourceService, ngTableParams) {
        
        $scope.datasources = [];

        $scope.types = DatasourceService.getTypes();

        $scope.showFilter = false;
        $scope.filter = {};
        
        $scope.tableParams = new ngTableParams({
            count:50,
            page:1,
            filter: $scope.filter
        }, {
            getData: function ($defer, params) {
                return DatasourceService.list(params.url()).then(function(response){
                    $scope.datasources = response.data.content;
                    params.total(response.data.totalElements);
//                    $defer.resolve(response.data.content);
                });
            },
            counts:[50,100,150,200]
        });

        $scope.bulkRemove = function (datasources) {
            DatasourceService.bulkRemove(datasources).then(function(){
                angular.forEach(datasources, function(datasource){
                    $scope.datasources.splice(
                        $scope.datasources.indexOf(datasource), 1);
                });
            });
        };
    });
});