define([
    'connecta.speaknow',
    'speaknow/action/service/action-service'
], function (speaknow) {
    return speaknow.lazy.controller('ActionViewController', function (
            $scope, ActionService, $routeParams, $location
            ) {

        if ($routeParams.id) {
            ActionService.get($routeParams.id).success(function (data) {
                $scope.action = data;
            });
        } else {
            console.error("Id da interaction não informado na url");
            $location.path('speaknow/interaction');
        }

        //TODO caixa de dialogo de confirmação do delete
        $scope.delete = function (id) {
            ActionService.delete(id).success(function () {
                console.info("Interaction Deletada com sucesso!");
                $scope.tableParams.reload();
            });
        };

    });
});