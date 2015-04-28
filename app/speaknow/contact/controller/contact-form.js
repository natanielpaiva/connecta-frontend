define([
    'connecta.speaknow',
    'speaknow/contact/service/contact-service'
], function (presenter) {
    return presenter.lazy.controller('ContactFormController', function ($scope, ContactService, $location, $routeParams) {
        $scope.contact = null;
        
        if ($routeParams.id) {
            //TOOD: Implementar update
        } 
        
        $scope.submit = function () {
            ContactService.save($scope.contact).then(function () {
                $location.path('speaknow/contact');
            }, function (response) {});
        };
    });
});