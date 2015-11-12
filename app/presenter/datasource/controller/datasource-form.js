define([
    'connecta.presenter',
    'presenter/datasource/service/datasource-service'
], function (presenter) {
    return presenter.lazy.controller('DatasourceFormController', function ($scope, DatasourceService, $location, $routeParams) {

        $scope.types = DatasourceService.getTypes();

        $scope.datasource = {
            parameters:[]
        };

        if ($routeParams.id) {
            DatasourceService.getById($routeParams.id).then(function (response) {
                $scope.datasource = response.data;
            });
        } else {
            $scope.datasource.type = Object.keys($scope.types)[0];
        }

        $scope.submit = function () {
            DatasourceService.save($scope.datasource).then(function () {
                $location.path('presenter/datasource');
            });
        };
    });
});