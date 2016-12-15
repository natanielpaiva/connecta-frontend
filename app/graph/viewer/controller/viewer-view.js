define([
    'connecta.graph',
    'graph/viewer/service/viewer-service',
    'graph/viewer/filter/bullet'
], function (graph) {
    return graph.lazy.controller('ViewerViewController', function ($scope, ViewerService, $routeParams, $location, notify) {

        ViewerService.getById($routeParams.id).then(function (response) {
            $scope.viewer = response.data;

            $scope.types = ViewerService.getTypes();

            $scope.excluir = function (id) {
                ViewerService.remove(id).then(function () {
                    $location.path('graph/viewer');
                });
            };

            $scope.testConnection = function () {
                ViewerService.testConnection($scope.viewer).then(function () {
                    notify.success('Conexão feita com sucesso.');
                });
            };
        });

    });
});