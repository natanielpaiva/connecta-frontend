define([
    'connecta.graph',
    'graph/datasource/service/datasource-service',
    'graph/datasource/filter/bullet'
], function (graph) {
    return graph.lazy.controller('DatasourceViewController', function ($scope, DatasourceService, $routeParams, $location, notify) {

        DatasourceService.getById($routeParams.id).then(function (response) {
            $scope.datasource = response.data;

            $scope.types = DatasourceService.getTypes();

            $scope.excluir = function (id) {
                DatasourceService.remove(id).then(function () {
                    $location.path('graph/datasource');
                });
            };

            $scope.testConnection = function () {
                DatasourceService.testConnection($scope.datasource).then(function () {
                    notify.success('Conexão feita com sucesso.');
                });
            };
        });

    });
});