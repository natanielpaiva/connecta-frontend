define([
    'connecta.speaknow',
    'speaknow/company-contact/service/company-contact-service'
], function(speaknow){
    return speaknow.lazy.controller('CompanyContactViewController', 
        function($scope, CompanyContactService, $routeParams, $location, ngTableParams){
        
        $scope.companyContact = {};
        
        if ($routeParams.id) {
            CompanyContactService.get($routeParams.id).success(function(data){
                $scope.companyContact = data;
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
                var data = $scope.companyContact.contacts;
                params.total(data.length);
                return $defer.resolve(data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            },
            counts: [20, 50, 100]
        });
        
        
    });
});