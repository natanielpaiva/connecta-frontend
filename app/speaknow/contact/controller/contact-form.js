define([
    'connecta.speaknow',
    'speaknow/contact/service/contact-service',
    'portal/layout/service/notify'
], function (presenter) {
    return presenter.lazy.controller('ContactFormController', 
            function ($scope, ContactService, $location, $routeParams, $translate ,notify) {
        $scope.contact = null;
        
        if ($routeParams.id) {
            ContactService.get($routeParams.id).success(function (data) {
                $scope.isEditing = true;
                $scope.contact = data;
            });
        } 
        
        $scope.submit = function () {
            ContactService.save($scope.contact).then(function () {
                $translate('CONTACT.SAVE_SUCCESS').then(function (text) {
                    notify.success(text);
                    $location.path('speaknow/contact');
                });
            }, function (response) {});
        };
    });
});