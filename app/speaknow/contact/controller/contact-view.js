define([
    'connecta.speaknow',
    'speaknow/contact/service/contact-service',
], function(speaknow){
    return speaknow.lazy.controller('ContactViewController', 
        function($scope, ContactService, $routeParams, $location){
        
        $scope.contact = {};
        
        if ($routeParams.id) {
            ContactService.get($routeParams.id).success(function(data){
                $scope.contact = data;
            });
        } else {
            $location.path('speaknow/contact');
        }
    });
});