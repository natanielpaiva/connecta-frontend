/* global angular */

define([
    'connecta.presenter',
    'presenter/singlesource/service/singlesource-service',
    'portal/layout/service/confirm'
], function (presenter) {
    return presenter.lazy.controller('SingleSourceListController', function ($scope, $confirm, SingleSourceService, fileExtensions, ngTableParams) {
        $scope.types = SingleSourceService.getTypes();

        $scope.showFilter = false;
        $scope.filter = {};

        $scope.singlesources = [];

        $scope.tableParams = new ngTableParams({
            count: 50,
            page: 1,
            filter: $scope.filter
        }, {
            getData: function ($defer, params) {
                return SingleSourceService.list(params.url()).then(function(response){
                    $scope.singlesources = response.data.content;
                    params.total(response.data.totalElements);
                });
            },
            counts: [50, 100, 150, 200]
        });

        $scope.bulkRemove = function (singlesources) {
            $confirm('SINGLESOURCE.BULK_DELETE_CONFIRM', 'SINGLESOURCE.BULK_CONFIRM_DELETE').then(function(){
                SingleSourceService.bulkRemove(singlesources).then(function () {
                    angular.forEach(singlesources, function (singlesource) {
                        $scope.singlesources.splice(
                                $scope.singlesources.indexOf(singlesource), 1);
                    });
                });
            });
        };
    });
});

