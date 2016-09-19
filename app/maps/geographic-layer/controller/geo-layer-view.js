define([
  "connecta.maps",
  "maps/geographic-layer/service/geo-layer-service",
  "maps/spatial-datasource/service/spatial-datasource-service"
], function (maps) {

  return maps.lazy.controller("GeoLayerViewController", function ($scope, $routeParams, GeoLayerService, SpatialDataSourceService) {

    var id;

    init();

    function init() {

      id = $routeParams.id;

      getLayer();

    }

    function getLayer() {

      GeoLayerService.get(id).then(onSuccess, onError);

      function onSuccess(response) {
        $scope.layer = response.data;
        getSpatialDS($scope.layer.spatialDataSourceId);
      }

      function onError(err) {
        throw Error(err);
      }

    }

    function getSpatialDS(id) {
      SpatialDataSourceService.get(id).then(onSuccess, onError);

      function onSuccess(response) {
        $scope.layer.spatialDataSource = response.data;
      }

      function onError(err) {
        throw Error(err);
      }
    }

    $scope.delete = function (id) {
      GeoLayerService.delete(id).then(onSucess, onError);

      function onSuccess() {
        notify.info("GEO_LAYER.DELETE_SUCCESS");
      }

      function onError(error) {
        if (error) {
          notify.error(error.statusText);
        } else {
          notify.error("GEO_LAYER.DELETE_ERROR");
        }
      }

    };


  });

});
