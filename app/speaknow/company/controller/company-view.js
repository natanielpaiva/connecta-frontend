define([
    'connecta.speaknow',
    'speaknow/company/service/company-service',
    'speaknow/company-contact-group/service/contact-group-service'
], function(speaknow){
    return speaknow.lazy.controller('CompanyViewController', 
        function($scope, CompanyService, ContactGroupService, $routeParams, $location, ngTableParams){
        
        $scope.company = {};
        
        if ($routeParams.id) {
            CompanyService.get($routeParams.id).success(function(data){
                $scope.company = data;
                $scope.getGroups();
                ContactGroupService.setCompany($scope.company);
            });
        } else {
            $location.path('speaknow/company');
        }
        
        $scope.getGroups = function(){
            $scope.tableParams = new ngTableParams({
                count: 10,
                page: 1,
                filter: $scope.search
            }, {
                getData: function ($defer, params) {
                    var data = $scope.company.companyContacts;
                    params.total(data.length);
                    return $defer.resolve(data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                },
                counts: [20, 50, 100]
            });
        };
    });
});