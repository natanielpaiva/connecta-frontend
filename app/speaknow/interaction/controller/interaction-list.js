define([
    'connecta.speaknow',
    'speaknow/interaction/service/interaction-service',
    'portal/layout/service/notify'
], function (speaknow) {
    return speaknow.lazy.controller('InteractionListController', function (
            $scope, InteractionService, ngTableParams, notify
            ) {

        $scope.search = {
            name: ''
        };

        $scope.tableParams = new ngTableParams({
            count: 10,
            page: 1,
            filter: $scope.search
        }, {
            getData: function ($defer, params) {
                return InteractionService.list(params.url()).then(function (response) {
                    params.total(response.data.totalElements);
                    $defer.resolve(response.data.content);
                });
            },
            counts: [10, 30, 50, 100]
        });
        
        //TODO caixa de dialogo de confirmação do delete
        $scope.delete = function (id) {
            InteractionService.delete(id).success(function () {
                notify.success("interaçao Deletada com sucesso!");
                $scope.tableParams.reload();
            });
        };
        
        $scope.modalParams = {
            title: 'Exclusão de Interações',
            text: 'Deseja realmente excluir esta interaçao?',
            size: 'sm',
            success: $scope.delete
        };

    });
});