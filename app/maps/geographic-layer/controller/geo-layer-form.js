define([
  "connecta.maps",
  "maps/spatial-datasource/service/spatial-datasource-service"
], function (maps) {

  return maps.lazy.controller("GeoLayerFormController", function ($scope, SpatialDataSourceService) {

    $scope.spatialDataSources = {};

    SpatialDataSourceService.list().then(onSuccess, onError);

    function onSuccess(response) {
      $scope.spatialDataSources = response.data.content;
    }

    function onError(error) {
      throw Error(error);
    }


  });

});
