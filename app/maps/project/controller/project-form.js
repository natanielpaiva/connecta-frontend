define([
    "connecta.maps",
    "maps/project/storage/basemaps",
    "maps/project/storage/steps",
    'maps/helper/map',
    "maps/project/storage/tools",
    "maps/project/storage/context-config",
    "maps/project/service/project-service",
    "maps/spatial-datasource/service/spatial-datasource-service",
    "maps/geographic-layer/service/geo-layer-service",
    "maps/project/directive/menu-carrousel",
    "maps/project/directive/input-slider",
    "maps/datasource/service/datasource-service"
], function (maps, baseMapsConfig, stepsConfig, mapHelper, toolsConfig, contextConfig) {

    return maps.lazy.controller("ProjectFormController", function ($scope, $timeout, ProjectService, SpatialDataSourceService, GeoLayerService, DatasourceService, notify) {

        $scope.project = {
            baseMaps : [],
            widgets : {},
            tools : [],
            serviceType : "connecta"
        };

        $scope.richLayer = {
            crossingKeys : {
                geoKey : {},
                resultSetkey : {}
            }
        };

        var WatcherEnum = {
            MAP_CENTER: 'mapCenter',
            MAX_ZOOM: 'maxZoom',
            MIN_ZOOM: 'minZoom',
            INITIAL_ZOOM: 'initialZoom'
        };

        $scope.watchers = {};

        $scope.zoomConfig = {
            minZoom: 1,
            maxZoom: 10
        };

        $scope.currentWatcher = undefined;

        $scope.mapInit = function () {
            mapHelper.buildMap('_mapDiv')

                .catch(function (error) {
                    console.error(error);
                })
                .then(function (map) {
                    $scope.mapCenter = mapHelper.getCenter();
                    $scope.$apply();
                    $scope.watchers[WatcherEnum.MAP_CENTER] = mapHelper.watchCenterChange(function (position) {
                        $scope.mapCenter = position;
                        $scope.$apply();
                    }, true);

                    $scope.watchers[WatcherEnum.MIN_ZOOM] = mapHelper.watchZoomChange(function (zoom) {
                        $scope.configSlider.minZoom = zoom;
                        $scope.$apply();
                    }, true);

                    $scope.watchers[WatcherEnum.MAX_ZOOM] = mapHelper.watchZoomChange(function (zoom) {
                        $scope.configSlider.maxZoom = zoom;
                        $scope.$apply();
                    }, true);

                });
        };

        $scope.setCurrentWatcher = function (watcher) {

            if ($scope.currentWatcher) {
                $scope.watchers[$scope.currentWatcher].pause();
            }

            if (watcher === $scope.currentWatcher) {
                $scope.currentWatcher = undefined;
                return;
            }

            $scope.currentWatcher = watcher;

            if (watcher === WatcherEnum.MAP_CENTER) {
                mapHelper.setCenter($scope.mapCenter);
            }
            if (watcher === WatcherEnum.MAX_ZOOM) {
                mapHelper.setZoom($scope.configSlider.maxZoom);
            }
            if (watcher === WatcherEnum.MIN_ZOOM) {
                mapHelper.setZoom($scope.configSlider.minZoom);
            }

            $scope.currentWatcher = watcher;
            $scope.watchers[$scope.currentWatcher].resume();

        };

        $scope.updateZoomConfig = function (sender) {
            if ($scope.currentWatcher === sender) {
                mapHelper.setZoom($scope.configSlider[sender]);
            }
        };

        $scope.updateCenter = function () {
            if ($scope.currentWatcher === WatcherEnum.MAP_CENTER) {
                $scope.watchers[$scope.currentWatcher].pause();
                mapHelper.setCenter($scope.mapCenter);
                $scope.watchers[$scope.currentWatcher].resume();
            }
        };

        $scope.currentStep = 1;

        $scope.steps = angular.copy(stepsConfig);

        $scope.baseMapThumbUrl = 'app/maps/project/template/_project_base_map_thumb.html';

        $scope.baseMaps = baseMapsConfig.baseMaps;

        $scope.tools = toolsConfig;

        $scope.context = contextConfig;

        $scope.changeStep = function (increment) {

            var active = "active",
                disabled = "disabled",
                complete = "complete",
                nextStep;

            if (increment) {
                $scope.steps[$scope.currentStep].style = complete;
                nextStep = $scope.currentStep + 1;
            } else {
                $scope.steps[$scope.currentStep].style = disabled;
                nextStep = $scope.currentStep - 1;
            }

            $scope.steps[nextStep].style = active;
            $scope.currentStep = nextStep;

        };

        $scope.checkAllMapTools = function (sectionName, value) {

            var sectionTools = $scope.tools[sectionName];

            if (sectionTools instanceof Array) {
                for (var tool in $scope.project[sectionName]) {
                    $scope.project[sectionName][tool].active = value;
                }
            } else {
                for (var tool in $scope.tools[sectionName]) {
                    $scope.project[sectionName][tool] = value;
                }
            }

        };

        $scope.configSlider = {
            minZoom : 3,
            maxZoom : 13,
            options : {
                floor: 1,
                ceil: 15,
                step: 1,
                getPointerColor : function () {
                    return '#3bb79d';
                },
                getSelectionBarColor : function () {
                    return '#3bb79d';
                },
                minRange: 1,
                pushRange: true
            }
        };

//---------- [JS - PROJECT-FORM-LINK-DATASOURCE] -----------//

        $scope.flag_add = true;
        $scope.layersBySpatials = [];
        $scope.columnsByLayer = [];

        $scope.toggleOptionAdd = function () {
            if ($scope.flag_add) {
                SpatialDataSourceService.list({size : "*"}).then(onSuccessListSpatialDS, onError);
                DatasourceService.listConnectaDatasources().then(onSuccesListDataSources, onError);
            }

            $scope.flag_add = !$scope.flag_add;
        };

        $scope.getLayersBySpatialDS = function (id_spatial_ds) {
            GeoLayerService.getLayersByDS(id_spatial_ds).then(onSuccessGetLayerBySpatialDS, onError);
        };

        $scope.getColumnsByLayer = function (id_layer) {
            if (typeof id_layer != 'undefined') {
                for (var i in $scope.layersBySpatials) {
                    if ($scope.layersBySpatials[i]._id == id_layer)
                        $scope.columnsByLayer = $scope.layersBySpatials[i].layerFields;
                }
            } else {
                $scope.columnsByLayer = [];
            }
        };

        $scope.onDataSourceChange = function (id) {
            DatasourceService.listColumnsByDatasourceId(id).then(function (response) {
                if (response.data) {
                    $scope.columns = response.data.analysisColumns;
                }
            });
        };

        function onSuccessListProject(response) {
            $scope.projects = response.data.content;
            console.log($scope.projects);
        }

        function onSuccessListSpatialDS(response) {
            $scope.spatialDataSources = response.data.content;
        }

        function onSuccessGetLayerBySpatialDS(response) {
            $scope.layersBySpatials = response.data.content;
            if ($scope.layersBySpatials.length === 0) {
                notify.error("Nenhuma camada cadastrada");
            }
            $scope.columnsByLayer = [];
        }

        function onError(error) {
            if (error) {
                notify.error(error.statusText);
            }
            throw Error(error);
        }

        function onSuccesListDataSources(response) {
            $scope.datasources = response.data.content;
        }

//---------- [JS - PROJECT-FORM-LINK-DATASOURCE] -----------//
    });

});
