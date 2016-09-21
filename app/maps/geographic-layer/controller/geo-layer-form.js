define([
  "connecta.maps",
  'maps/helper/map',
  "maps/spatial-datasource/service/spatial-datasource-service",
  "maps/geographic-layer/service/geo-layer-service"
], function (maps, mapHelper) {

  return maps.lazy.controller("GeoLayerFormController", function ($scope, SpatialDataSourceService, GeoLayerService, $location, $routeParams) {

    $scope.geoLayer = {};
    $scope.layers = [];
    $scope.spatialDataSources = {};
    var isEdit = false;

    $scope.initMap = function () {
      var promise = mapHelper.buildMap('_mapDiv');
      promise.catch(function (err) {
        console.error(err);
      });
      promise.then(function (map) {

      });
    };

    if ($routeParams.id) {
      GeoLayerService.get($routeParams.id).then(onSuccessEdit, onError);
    }

    $scope.changeSelectedLayer = function (layerId) {
      var params = {};
      params.layer = {
        layerIdentifier: layerId,
        spatialDataSourceId: $scope.selectedSpatialDatasource._id
      };

      var promise = GeoLayerService.query(params);
      promise.catch(function (err) {
        console.error(err);
      });
      promise.then(function (response) {
        mapHelper.addLayer(response.data);
      });

    };

    SpatialDataSourceService.listAll().then(onSuccessListSpatialDS, onError);

    $scope.getLayersBySpatialDS = function (spatialDatasource) {
      $scope.selectedSpatialDatasource = spatialDatasource;
      SpatialDataSourceService.getLayersBySpatialDS(spatialDatasource._id).then(onSuccessGetLayers, onError);
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
      if (error) {
        // notify.error(error.statusText);
      }else {
        // notify.error("GEO_LAYER.ERROR_OPERATION");
      }

      throw Error(error);
    }

    function onSuccessGetLayers(response) {
      $scope.layers = response.data;
    }

    function onSuccessSaveLayer(response) {
      $location.path("/maps/geo-layer/" + response.data._id + "/edit");
      // notify.success("GEO_LAYER.SAVE_SUCCESS");
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
      // notify.success("GEO_LAYER.SAVE_SUCCESS");
    }

    function update(id, geoLayer) {
      if (geoLayer.queryCache !== undefined|| geoLayer.getBreaksCache !== undefined) {
          geoLayer.geoCache = {
            "queryCache": geoLayer.queryCache,
            "getBreaksCache": geoLayer.getBreaksCache
          };
      }

      GeoLayerService.update(id, geoLayer).then(onSuccessUpdate, onError);
    }

  });

});
