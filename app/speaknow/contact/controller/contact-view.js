define([
    'connecta.speaknow',
    'speaknow/contact/service/contact-service',
    'portal/layout/service/notify'
], function(speaknow){
    return speaknow.lazy.controller('ContactViewController', 
        function($scope, ContactService, $routeParams, $location, notify){
        
        $scope.contact = {};
        
        if ($routeParams.id) {
            ContactService.get($routeParams.id).success(function(data){
                $scope.contact = data;
            });
        } else {
            $location.path('speaknow/contact');
        }
        
        $scope.delete = function (id) {
            ContactService.delete(id).success(function () {
                notify.success('CONTACT.REMOVE_SUCCESS');
                $scope.tableParams.reload();
            });
        };
        
        $scope.modalParams = {
            title: 'Exclusão de contato',
            text: 'Deseja realmente excluir este contato?',
            size: 'sm',
            success: $scope.delete
        };
    });
});