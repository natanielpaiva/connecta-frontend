define([
    'connecta.speaknow',
    'speaknow/contact/service/contact-service',
    'portal/layout/service/notify'
], function (presenter) {
    return presenter.lazy.controller('ContactFormController', 
            function ($scope, ContactService, $location, $routeParams ,notify) {
        $scope.contact = null;
        
        if ($routeParams.id) {
            ContactService.get($routeParams.id).success(function (data) {
                $scope.isEditing = true;
                $scope.contact = data;
            });
        } 
        
        $scope.submit = function () {
            ContactService.save($scope.contact).then(function () {
                notify.success('CONTACT.SAVE_SUCCESS');
                $location.path('speaknow/contact');
            }, function (response) {
                notify.warning('CONTACT.SAVE_ERROR');
            });
        };
    });
});