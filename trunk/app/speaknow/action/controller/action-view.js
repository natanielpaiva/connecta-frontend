define([
    'connecta.speaknow',
    'speaknow/action/service/action-service',
    'portal/layout/service/notify'
], function (speaknow) {
    return speaknow.lazy.controller('ActionViewController', function (
            $scope, ActionService, $routeParams, $location, $translate,notify
            ) {

        if ($routeParams.id) {
            ActionService.get($routeParams.id).success(function (data) {
                $scope.action = data;
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
            title: 'Exclusão de Actions',
            text: 'Deseja realmente excluir esta ação?',
            size: 'sm',
            success: $scope.delete
        };

    });
});