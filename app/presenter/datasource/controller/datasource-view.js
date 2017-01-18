define([
    'connecta.presenter',
    'presenter/datasource/service/datasource-service',
    'presenter/datasource/filter/bullet',
    'portal/layout/service/confirm'
], function (presenter) {
    return presenter.lazy.controller('DatasourceViewController', function ($scope, $confirm, DatasourceService, $routeParams, $location, notify) {

        DatasourceService.getById($routeParams.id).then(function (response) {
            $scope.datasource = response.data;

            $scope.types = DatasourceService.getTypes();

            $scope.excluir = function (id) {
                $confirm('DATASOURCE.BULK_DELETE_CONFIRM', 'DATASOURCE.BULK_CONFIRM_DELETE').then(function(){
                    DatasourceService.remove(id).then(function () {
                        $location.path('presenter/datasource');
                    });
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