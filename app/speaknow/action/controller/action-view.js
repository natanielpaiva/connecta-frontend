define([
    'connecta.speaknow',
    'speaknow/action/service/action-service',
    'portal/layout/service/notify'
], function (speaknow) {
    return speaknow.lazy.controller('ActionViewController', function (
            $scope, ActionService, $routeParams, $location, $translate,notify
            ) {

        if ($routeParams.id) {
            ActionService.get($routeParams.id).then(function (response) {
                $scope.action = response.data;
            }, function(error){
                $location.path('speaknow/interaction');
            });
        } else {
            console.error("Id da interaction não informado na url");
            $location.path('speaknow/interaction');
        }

        $scope.delete = function (id) {
            ActionService.delete(id).success(function () {
                $location.path('speaknow/interaction/' + $scope.action.interaction.id);
            });
        };
        
        $scope.modalParams = {
            title: 'Exclusão de Ação',
            text: 'Deseja realmente excluir esta ação?',
            size: 'sm',
            success: $scope.delete
        };

    });
});