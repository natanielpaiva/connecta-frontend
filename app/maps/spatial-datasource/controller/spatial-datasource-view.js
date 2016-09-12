define([
  "connecta.maps",
  "maps/spatial-datasource/service/spatial-datasource-service"
], function (maps) {


  return maps.lazy.controller("SpatialDataSourceViewController", function ($scope, SpatialDataSourceService, $routeParams, $location, notify) {

    $scope.spatialDataSource = {};

    if ($routeParams.id) {
      SpatialDataSourceService.get($routeParams.id).success(function (data) {
        $scope.spatialDataSource = data;
        console.info("OK ==>", data);
      }).error(function (error) {
        console.info("Erro ==>", error);
      });
    }

    $scope.edit = function (id) {
      $location.path("/maps/spatial-datasource/" + id + "/edit");
    };

    $scope.backToList = function(){
      $location.path("/maps/spatial-datasource");
    };

    $scope.delete = function (id) {
      SpatialDataSourceService.delete(id).success(function () {
        notify.info('Registro excluido com sucesso!');
        $scope.backToList();
      }).error(function () {
        notify.error('Erro ao excluir registro');
      });
    };

  });
});
