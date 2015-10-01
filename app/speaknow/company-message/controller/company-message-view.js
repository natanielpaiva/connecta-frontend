define([
    'connecta.speaknow',
    'speaknow/company-message/service/company-message-service'
], function(speaknow){
    return speaknow.lazy.controller('CompanyMessageViewController', 
        function($scope, CompanyMessageService, $location, $routeParams){
        
        if ($routeParams.id) {
            CompanyMessageService.get($routeParams.id).success(function(data){
                $scope.message = data;
            });
        } else {
            $location.path('speaknow/company/message');
        }
        
        
    });
});