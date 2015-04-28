define([
    'connecta.speaknow',
    'speaknow/company/service/company-service'
], function(speaknow){
    return speaknow.lazy.controller('CompanyViewController', 
        function($scope, CompanyService, $routeParams, $location, ngTableParams){
        
        $scope.company = {};
        
        if ($routeParams.id) {
            CompanyService.get($routeParams.id).success(function(data){
                $scope.company = data;
            });
        } else {
            $location.path('speaknow/company');
        }
        
        $scope.tableParams = new ngTableParams({
            count: 10,
            page: 1,
            filter: $scope.search
        }, {
            getData: function ($defer, params) {
                var data = $scope.company.companyContacts;
                return $defer.resolve(data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            },
            counts: [20, 50, 100]
        });
        
        
    });
});