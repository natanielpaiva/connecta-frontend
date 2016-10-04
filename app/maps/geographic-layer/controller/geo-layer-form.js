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
        $scope.isLoadingLayer = false;

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
                            geometryField: layer.geometryField.name,
                            spatialDataSourceId: layer.spatialDataSourceId,
                            layerIdentifier: layer.layerIdentifier,
                            info: layer.info,
                            layerFields: layer.layerFields,
                            geometryType: layer.geometryType
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
                                $scope.selectedLayer = {
                                    layerIdentifier: $scope.layer.layerIdentifier
                                };
                                $scope.changeSelectedLayer($scope.layer);
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
                var promise = mapHelper.buildMap($scope.mapNodeId, {attributionControl: false});
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
                delete $scope.selectedSpatialDataSource[$scope.layer.layerIdentifier];
                $scope.layers = [];
                if (!spatialDataSourceId) {
                    return;
                }
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

        $scope.changeSelectedLayer = function (layer) {
            if (!layer.layerIdentifier) {
                return;
            }
            if ($scope.selectedSpatialDataSource[layer.layerIdentifier]) {
                mapHelper.previewLayer($scope.selectedSpatialDataSource[layer.layerIdentifier]);
            } else {
                var params = {};
                params.layer = JSON.stringify(layer);
                params.queryParams = JSON.stringify({
                    outSR: 4269,
                    outFields: ['*']
                });
                var mapId = mapHelper.map._leaflet_id;
                var promise = GeoLayerService.query(params);
                $scope.isLoadingLayer = true;
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
                        var geoJSONLayer = mapHelper.buildLayer(response.data);
                        $scope.selectedSpatialDataSource[layer.layerIdentifier] = geoJSONLayer;
                        $scope.selectedSpatialDataSource[layer.layerIdentifier].type = geometryType[response.data.geometryType];
                        $scope.selectedSpatialDataSource[layer.layerIdentifier].srid = response.data.spatialReference.wkid;
                        mapHelper.previewLayer(geoJSONLayer);
                        $scope.isLoadingLayer = false;
                    } catch (err) {
                        $scope.isLoadingLayer = false;
                        notify.error(err.statusText);
                    }
                });
                $scope.layer.layerIdentifier = layer.layerIdentifier;
            }
        };

        $scope.save = function () {
            var promise;
            for (var key in $scope.selectedLayer) {
                $scope.layer[key] = $scope.selectedLayer[key];
            }
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
                notify.success("GEO_LAYER.SAVE_SUCCESS");
            });
        };
    });
});

