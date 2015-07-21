define([
    'connecta.inspection',
    'inspection/person/service/person-service',
    'portal/layout/service/notify'
], function (inspection) {
    return inspection.lazy.controller('PersonListController', function (
            $scope, PersonService, ngTableParams, notify) {
        
            
        $scope.search = {
            name: ''
        };
        
        $scope.tableParams = new ngTableParams({
            count: 10,
            page: 1,
            filter: $scope.search
        }, {
            getData: function ($defer, params) {
                return PersonService.list(params.url()).then(function (response) {
                    params.total(response.data.totalElements);
                    $defer.resolve(response.data.content);
                });
            },
            counts: [10, 30, 50, 100]
        });
        
    });
});