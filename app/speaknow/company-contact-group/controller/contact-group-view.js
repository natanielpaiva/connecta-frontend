define([
    'connecta.speaknow',
    'speaknow/company-contact-group/service/contact-group-service',
    'speaknow/company-contact/service/company-contact-service'
], function(speaknow){
    return speaknow.lazy.controller('ContactGroupViewController', 
        function($scope, ContactGroupService, CompanyContactService, $routeParams, $location, ngTableParams){
        
        $scope.contactGroup = {};
        
        if ($routeParams.id) {
            ContactGroupService.get($routeParams.id).success(function(data){
                $scope.contactGroup = data;
                CompanyContactService.setContactGroup($scope.contactGroup);
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
                var data = $scope.contactGroup.contacts;
                if(data !== undefined){
                    params.total(data.length);
                    return $defer.resolve(data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                } else {
                    return 0;
                }
            },
            counts: [20, 50, 100]
        });
    });
});