define([
    'connecta.speaknow',
    'speaknow/company-contact-group/service/contact-group-service'
], function (presenter) {
    return presenter.lazy.controller('ContactGroupFormController', function ($scope, ContactGroupService, $location, $routeParams) {
        
        $scope.company = ContactGroupService.getCompany();
        $scope.contactGroup = {company:  $scope.company};
        
        if ($routeParams.id) {
            ContactGroupService.get($routeParams.id).success(function(data){
                $scope.contactGroup = data;
            });
        }
        
        $scope.submit = function () {
            ContactGroupService.save($scope.contactGroup).then(function () {
                $location.path('speaknow/company');
            });
        };
    });
});