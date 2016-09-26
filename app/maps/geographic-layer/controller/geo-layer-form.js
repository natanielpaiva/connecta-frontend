define([
    "connecta.maps",
    'maps/helper/map',
    "maps/spatial-datasource/service/spatial-datasource-service",
    "maps/geographic-layer/service/geo-layer-service"
], function (maps, mapHelper) {

    return maps.lazy.controller("GeoLayerFormController", function ($scope, $location, $routeParams, SpatialDataSourceService, GeoLayerService, notify) {

        var geometryType = {
            'esriGeometryPolygon': 'LAYER_TYPE.POLYGON',
            'esriGeometryPoint': 'LAYER_TYPE.POINT',
            'esriGeometryLine': 'LAYER_TYPE.LINE'
        };

        $scope.mapNodeId = '_mapDivId' + String (Math.round(Math.random() * 1000));

        $scope.selectedSpatialDataSource = {};

        init();

        function init() {
            loadSpatialDataSources();
            checkEdit();
        }

        function loadSpatialDataSources() {
            SpatialDataSourceService.list({size: '*'})
                .catch(function (err) {
                    notify.error(err.statusText);
                })
                .then(function (response) {
                    if (!response) {
                        return notify.error('Não foi possível obter resposta do servidor.');
                    }
                    $scope.spatialDataSources = response.data.content;
                });
        }

        function checkEdit() {
            if ($routeParams.id) {
                $scope.isEditing = true;
                var promise = GeoLayerService.get($routeParams.id);
                promise.catch(function (err) {
                    notify.error(err.statusText);
                });
                promise.then(function (response) {
                    try {
                        if (!response) {
                            return notify.error('Não foi possível obter resposta do servidor.');
                        }
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
                                notify.error(err.statusText);
                            })
                            .then(function (response) {
                                if (!response) {
                                    return notify.error('Não foi possível obter resposta do servidor.');
                                }
                                $scope.layers = response.data;
                                $scope.selectedLayer = {layerIdentifier: $scope.layer.layerIdentifier};
                                $scope.changeSelectedLayer($scope.layer.layerIdentifier);
                            });
                    } catch (err) {
                        notify.error(err.statusText);
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
                    notify.error(err.statusText);
                });
                promise.then(function (map) {
                    //
                });
            }, 10);
        };

        $scope.listLayers = function (spatialDataSourceId) {
            try {
                $scope.layer.spatialDataSourceId = spatialDataSourceId;
                var promise = SpatialDataSourceService.getLayersBySpatialDS(spatialDataSourceId);
                promise.catch(function (err) {
                    notify.error(err.statusText);
                });
                promise.then(function (response) {
                    if (!response) {
                        return notify.error('Não foi possível obter resposta do servidor.');
                    }
                    $scope.layer.spatialDataSourceId = spatialDataSourceId;
                    $scope.layers = response.data;
                });
            } catch (err) {
                notify.error(err.statusText);
            }
        };

        $scope.changeSelectedLayer = function (layerId) {
            if ($scope.selectedSpatialDataSource[layerId]) {
                mapHelper.previewLayer($scope.selectedSpatialDataSource[layerId]);
            } else {
                var params = {};
                params.layer = {
                    layerIdentifier: layerId,
                    spatialDataSourceId: $scope.layer.spatialDataSourceId
                };
                var mapId = mapHelper.map._leaflet_id;
                var promise = GeoLayerService.query(params);
                promise.catch(function (err) {
                    notify.error(err.statusText);
                });
                promise.then(function (response) {
                    try {
                        if (!response) {
                            return notify.error('Não foi possível obter resposta do servidor.');
                        }
                        if (mapId !== mapHelper.map._leaflet_id) {
                            return;
                        }
                        var layer = mapHelper.buildLayer(response.data);
                        $scope.selectedSpatialDataSource[layerId] = layer;
                        $scope.selectedSpatialDataSource[layerId].type = geometryType[response.data.geometryType];
                        $scope.selectedSpatialDataSource[layerId].srid = response.data.spatialReference.wkid;
                        mapHelper.previewLayer(layer);
                    } catch (err) {
                        notify.error(err.statusText);
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
                notify.error(err.statusText);
            });
            promise.then(function (response) {
                $location.path("/maps/geo-layer");
            });
        };
    });
});

