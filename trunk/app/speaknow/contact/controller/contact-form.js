define([
    'connecta.speaknow',
    'speaknow/contact/service/contact-service'
], function (presenter) {
    return presenter.lazy.controller('ContactFormController', function ($scope, ContactService, $location, $routeParams) {
        $scope.contact = null;
        
        if ($routeParams.id) {
            ContactService.get($routeParams.id).success(function (data) {
                $scope.contact = data;
            });
        } 
        
        $scope.submit = function () {
            ContactService.save($scope.contact).then(function () {
                $location.path('speaknow/contact');
            }, function (response) {});
        };
    });
});