define([
    'connecta.datamodel',
    'datamodel/datasource/service/datasource-service'
], function (datamodel) {
    return datamodel.lazy.controller('DatasourceViewController', function ($scope, DatasourceService, $routeParams, $location) {

        DatasourceService.getById($routeParams.id).then(function (response) {
            $scope.datasource = response.data;
            
            $scope.types = DatasourceService.getTypes();

            $scope.excluir = function (id) {
                DatasourceService.remove(id).then(function(){
                    $location.path('datamodel/datasource');
                });
            };
        });

    });
});