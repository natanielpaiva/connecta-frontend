define([
  "connecta.maps",
  "maps/spatial-datasource/service/spatial-datasource-service"
], function (maps) {

  return maps.lazy.controller("SpatialDataSourceListController", function ($scope, SpatialDataSourceService, $location) {

    $scope.spatialDataSources = {};

    SpatialDataSourceService.list().success(function (response) {
      $scope.spatialDataSources = response.data;
      console.info("OK ==>", response);
    }).error(function (error) {
      console.info("Erro ==>", error);
    });

    $scope.openView = function (id) {
      $location.path("/maps/spatial-datasource/" + id + "/view");
    };


  });

});
