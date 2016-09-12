define([
  "connecta.maps",
  "maps/spatial-datasource/service/spatial-datasource-service"
], function (maps) {

  return maps.lazy.controller("GeoDataSourceFormController", function ($scope, SpatialDataSourceService, $location, $routeParams, notify) {
    $scope.spatialDataSource = {};
    $scope.isEdit = false;

    if ($routeParams.id) {
      SpatialDataSourceService.get($routeParams.id).success(function (data) {
        $scope.spatialDataSource = data;
        $scope.isEdit = true;
      });
    }

    $scope.save = function (spatialDataSource) {
      SpatialDataSourceService.save(spatialDataSource).success(function (data) {
        notify.success("Deu certo");
        console.info('OK ==>', data);
      }).error(function (error) {
        notify.error("Deu errado");
        console.info('Erro ==>', error);
      });
    };

    $scope.backToList = function () {
      $location.path("/maps/spatial-datasource");
    };


    $scope.update = function (spatialDataSource) {
      SpatialDataSourceService.update(spatialDataSource).success(function (data) {
        notify.success("Deu certo");
      }).error(function (error) {
        notify.error("Deu errado");
      });
    };

  });

});
