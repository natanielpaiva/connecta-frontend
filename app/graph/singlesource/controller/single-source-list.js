/* global angular */

define([
    'connecta.graph',
    'graph/singlesource/service/singlesource-service'
], function (graph) {
    return graph.lazy.controller('SingleSourceListController', function ($scope, SingleSourceService, fileExtensions, ngTableParams) {
        $scope.types = SingleSourceService.getTypes();

        $scope.filter = false;

        $scope.singlesources = [];

        $scope.tableParams = new ngTableParams({
            count: 50,
            page: 1,
            filter: $scope.filter
        }, {
            getData: function ($defer, params) {
                return SingleSourceService.list(params.url()).then(function(response){
                    $scope.singlesources = response.data;
//                    params.total(response.data.totalElements);
                });
            },
            counts: [50, 100, 150, 200]
        });

        $scope.bulkRemove = function (singlesources) {
            SingleSourceService.bulkRemove(singlesources).then(function () {
                angular.forEach(singlesources, function (singlesource) {
                    $scope.singlesources.splice(
                            $scope.singlesources.indexOf(singlesource), 1);
                });
            });
        };
    });
});

