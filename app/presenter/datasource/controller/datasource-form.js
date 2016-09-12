define([
    'connecta.presenter',
    'presenter/datasource/service/datasource-service'
], function (presenter) {
    return presenter.lazy.controller('DatasourceFormController', function ($scope, DatasourceService, $location, $routeParams, util, notify) {
        $scope.mapToArray = util.mapToArray;

        $scope.form = {
            types: DatasourceService.getTypes(),
            drivers: DatasourceService.getDatabaseDrivers()
        };

        if ($routeParams.id) {
            DatasourceService.getById($routeParams.id).then(function (response) {
                $scope.datasource = response.data;
            });
        } else {
            $scope.datasource = {
                type: 'DATABASE',
                driver: 'ORACLE_SID',
                hdfsPort: 50070
            };

            $scope.$watch('datasource.driver', function (selected) {
                if (selected) {
                    $scope.datasource.port = $scope.form.drivers[selected].defaultPort;
                }
            });
        }
        
        $scope.testConnection = function () {
            DatasourceService.testConnection($scope.datasource).then(function () {
                notify.success('Conexão feita com sucesso!');
            });
        };

        $scope.submit = function () {
            DatasourceService.save($scope.datasource).then(function () {
                $location.path('presenter/datasource');
            });
        };
        
    });
});