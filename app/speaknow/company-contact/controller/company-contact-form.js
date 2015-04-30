define([
    'connecta.speaknow',
    'speaknow/company-contact/service/company-contact-service'
], function(speaknow){
    return speaknow.lazy.controller('CompanyContactFormController', 
        function($scope, CompanyContactService, $routeParams, $location, ngTableParams){
        
        $scope.contactGroup = CompanyContactService.getContactGroup();
        $scope.companyContact = {contactGroup : $scope.contactGroup};
        
        if ($routeParams.id) {
            CompanyContactService.get($routeParams.id).success(function(data){
                $scope.companyContact = data;
            });
        }
        
        $scope.submit = function () {
            CompanyContactService.save($scope.companyContact).then(function () {
                $location.path('speaknow/company');
            });
        };
    });
});