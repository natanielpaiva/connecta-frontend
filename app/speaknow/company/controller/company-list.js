define([
    'connecta.speaknow',
    'speaknow/company/service/company-service'
], function (speaknow) {
    return speaknow.lazy.controller('CompanyListController', function ($scope, CompanyService, ngTableParams) {
        
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

    });
});