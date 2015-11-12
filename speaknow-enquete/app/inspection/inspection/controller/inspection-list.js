define([
    'connecta.inspection',
    'inspection/inspection/service/inspection-service',
    'portal/layout/service/notify'
], function (inspection) {
    return inspection.lazy.controller('InspectionListController', function (
            $scope, InspectionService, ngTableParams, notify) {
        
            
        $scope.search = {
            name: ''
        };
        
        $scope.tableParams = new ngTableParams({
            count: 10,
            page: 1,
            filter: $scope.search
        }, {
            getData: function ($defer, params) {
                return InspectionService.list(params.url()).then(function (response) {
                    params.total(response.data.totalElements);
                    $defer.resolve(response.data.content);
                });
            },
            counts: [10, 30, 50, 100]
        });
        
    });
});