define([
  "connecta.maps",
  "maps/spatial-datasource/service/spatial-datasource-service"
], function (maps) {

  return maps.lazy.controller("SpatialDataSourceListController", function ($scope, SpatialDataSourceService, $location, notify) {

    $scope.spatialDataSources = {};

    SpatialDataSourceService.list().then(function (response) {
      $scope.spatialDataSources = response.data.data;
    }, function (error) {
      notify.error(error);
    });


    $scope.openView = function (id) {
      $location.path("/maps/spatial-datasource/" + id + "/view");
    };


  });

});
