define([
    'connecta.speaknow',
    'speaknow/interaction/service/interaction-service'
], function (speaknow) {
    return speaknow.lazy.controller('InteractionListController', function (
            $scope, InteractionService, ngTableParams
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
                console.info("Interaction Deletada com sucesso!");
                $scope.tableParams.reload();
            });
        };

    });
});