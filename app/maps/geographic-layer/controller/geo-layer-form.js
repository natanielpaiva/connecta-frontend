define([
  "connecta.maps",
  'maps/helper/map',
  "maps/spatial-datasource/service/spatial-datasource-service",
  "maps/geographic-layer/service/geo-layer-service"
], function (maps, mapHelper) {

  return maps.lazy.controller("GeoLayerFormController", function ($scope, $location, $routeParams, SpatialDataSourceService, GeoLayerService) {

    var geometryType = {
      'esriGeometryPolygon': 'LAYER_TYPE.POLYGON',
      'esriGeometryPoint': 'LAYER_TYPE.POINT',
      'esriGeometryLine': 'LAYER_TYPE.LINE'
    };

    $scope.mapNodeId = '_mapDivId' + String (Math.round(Math.random() * 1000));

    SpatialDataSourceService.list({size: '*'})
      .catch(function (err) {
        console.error(err);
      })
      .then(function (response) {
        $scope.spatialDataSources = response.data.content;
        loadForEdit();
      });

    function loadForEdit() {
      if ($routeParams.id) {
        $scope.isEditing = true;
        var promise = GeoLayerService.get($routeParams.id);
        promise.catch(function (err) {
          console.error(err);
        });
        promise.then(function (response) {
          try {
            var layer = response.data;
            $scope.layer = {
              _id: layer._id,
              title: layer.title,
              description: layer.description,
              geoCache: layer.geoCache,
              spatialDataSourceId: layer.spatialDataSourceId,
              layerIdentifier: layer.layerIdentifier
            };
            $scope.selectedSpatialDataSource = {_id: $scope.layer.spatialDataSourceId};
            SpatialDataSourceService.getLayersBySpatialDS($scope.layer.spatialDataSourceId)
              .catch(function (err) {
                console.error(err);
              })
              .then(function (response) {
                $scope.layers = response.data;
                $scope.selectedLayer = {layerIdentifier: $scope.layer.layerIdentifier};
                $scope.changeSelectedLayer($scope.layer.layerIdentifier);
              });
          } catch (err) {
            console.error(err);
          }
        });
      } else {
        $scope.layer = {
          geoCache: {
            queryCache: true,
            getBreaksCache: true
          }
        };
      }
    }

    $scope.initMap = function () {
      setTimeout(function () {
        var promise = mapHelper.buildMap($scope.mapNodeId);
        promise.catch(function (err) {
          console.error(err);
        });
        promise.then(function (map) {
          //
        });
      }, 10);
    };

    $scope.listLayers = function (spatialDataSourceId) {
      try {
        var promise = SpatialDataSourceService.getLayersBySpatialDS(spatialDataSourceId);
        promise.catch(function (err) {
          console.error(err);
        });
        promise.then(function (response) {
          $scope.layer.spatialDataSourceId = spatialDataSourceId;
          $scope.layers = response.data;
        });
      } catch (err) {
        console.error(err);
      }
    };

    $scope.changeSelectedLayer = function (layerId) {
      if ($scope.selectedSpatialDataSource[layerId]) {
        mapHelper.previewLayer($scope.selectedSpatialDataSource[layerId]);
      } else {
        var params = {};
        params.layer = {
          layerIdentifier: layerId,
          spatialDataSourceId: $scope.selectedSpatialDataSource._id
        };
        var mapId = mapHelper.map._leaflet_id;
        var promise = GeoLayerService.query(params);
        promise.catch(function (err) {
          console.error(err);
        });
        promise.then(function (response) {
          try {
            if (mapId !== mapHelper.map._leaflet_id) {
              return;
            }
            var layer = mapHelper.buildLayer(response.data);
            $scope.selectedSpatialDataSource[layerId] = layer;
            $scope.selectedSpatialDataSource[layerId].type = geometryType[response.data.geometryType];
            $scope.selectedSpatialDataSource[layerId].srid = response.data.spatialReference.wkid;
            mapHelper.previewLayer(layer);
          } catch (err) {
            throw new Error(err);
          }
        });
        $scope.layer.layerIdentifier = layerId;
      }
    };

    $scope.save = function () {
      var promise;
      if ($scope.isEditing) {
        promise = GeoLayerService.update($scope.layer._id, $scope.layer);
      } else {
        promise = GeoLayerService.save($scope.layer);
      }
      promise.catch(function (err) {
        console.error(err);
      });
      promise.then(function (response) {
        if (!$scope.isEditing) {
          $location.path("/maps/geo-layer/" + response.data._id + '/edit');
        } else {
          $location.path("/maps/geo-layer");
        }
        console.info(response);
      });
    };
  });
});

