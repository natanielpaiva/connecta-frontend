define([
    'connecta.speaknow',
    'speaknow/company-contact/service/company-contact-service',
    'portal/layout/service/notify'
], function(speaknow){
    return speaknow.lazy.controller('CompanyContactFormController', 
        function($scope, CompanyContactService, notify, $routeParams, $location, $translate, ngTableParams){
        
        $scope.contactGroup = CompanyContactService.getContactGroup();
        $scope.companyContact = {contactGroup : $scope.contactGroup};
        
        if ($routeParams.id) {
            CompanyContactService.get($routeParams.id).success(function(data){
                $scope.companyContact = data;
            });
        }
        
        $scope.submit = function () {
            CompanyContactService.save($scope.companyContact).then(function () {
                $translate('COMPANY.SUCCESS').then(function (text) {
                    notify.success(text);
                });
                $location.path('speaknow/company');
            });
        };
    });
});