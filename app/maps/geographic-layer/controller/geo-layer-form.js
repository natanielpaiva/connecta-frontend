define([
  "connecta.maps",
  "maps/spatial-datasource/service/spatial-datasource-service",
  "maps/geographic-layer/service/geo-layer-service"
], function (maps) {

  return maps.lazy.controller("GeoLayerFormController", function ($scope, SpatialDataSourceService, GeoLayerService, notify, $location, $routeParams) {

    $scope.geoLayer = {};
    $scope.layers = [];
    $scope.spatialDataSources = {};
    var isEdit = false;


    if ($routeParams.id) {
      GeoLayerService.get($routeParams.id).then(onSuccessEdit, onError);
    }

    SpatialDataSourceService.listAll().then(onSuccessListSpatialDS, onError);

    $scope.getLayersBySpatialDS = function (idSpatialDS) {
      SpatialDataSourceService.getLayersBySpatialDS(idSpatialDS).then(onSuccessGetLayers, onError);
    };

    $scope.save = function (geoLayer) {
      geoLayer = packObject(geoLayer);
      if (isEdit) {
        update(geoLayer._id, geoLayer);
        return;
      }
      GeoLayerService.save(geoLayer).then(onSuccessSaveLayer, onError);
    };


    function onSuccessListSpatialDS(response) {
      $scope.spatialDataSources = response.data;
    }

    function onError(error) {
      if(error){
        notify.error(error.statusText);
      }

      throw Error(error);
    }

    function onSuccessGetLayers(response) {
      $scope.layers = response.data;
    }

    function onSuccessSaveLayer(response) {
      $location.path("/maps/geo-layer/" + response.data._id + "/edit");
      notify.success("Sucesso");
    }

    function onSuccessEdit(response) {
      if (response.data.geoCache && response.data.geoCache.queryCache) {
          response.data.queryCache = {};
          response.data.queryCache = response.data.geoCache.queryCache;
      }

      if (response.data.geoCache && response.data.geoCache.getBreaksCache) {
          response.data.getBreaksCache = {};
          response.data.getBreaksCache = response.data.geoCache.getBreaksCache;
      }

      $scope.geoLayer = response.data;
      $scope.geoLayer.server = {"_id": response.data.spatialDataSourceId};
      $scope.getLayersBySpatialDS(response.data.spatialDataSourceId);
      $scope.geoLayer.layerIdentifier = {"id": response.data.layerIdentifier.toString()};

      isEdit = true;
    }

    function packObject(geoLayer) {
      geoLayer.serverType = geoLayer.server.serverType;
      geoLayer.spatialDataSourceId = geoLayer.server._id;
      geoLayer.layerIdentifier = geoLayer.layerIdentifier.id;
      return geoLayer;
    }

    function onSuccessUpdate(response) {
      $location.path("/maps/geo-layer");
      notify.success("GEO_DATASOURCE.SAVE_SUCCESS");
    }

    function update(id, geoLayer) {
      GeoLayerService.update(id, geoLayer).then(onSuccessUpdate, onError);
    }

  });

});
