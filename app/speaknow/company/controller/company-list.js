define([
    'connecta.speaknow',
    'speaknow/company/service/company-service',
    'portal/layout/service/notify'
], function (speaknow) {
    return speaknow.lazy.controller('CompanyListController', function ($scope, CompanyService, notify, ngTableParams) {
        
        $scope.companies = null;
        $scope.tableParams = new ngTableParams({
            count: 10,
            page: 1,
            filter: $scope.search
        }, {
            getData: function ($defer, params) {
                return CompanyService.list(params.url()).then(function (response) {
                    params.total(response.data.totalElements);
                    $defer.resolve(response.data.content);
                });
            },
            counts: [10, 30, 50, 100]
        });
        
        $scope.delete = function(id){
            CompanyService.delete(id).success(function () {
                $scope.tableParams.reload();
            });
        };

    });
});