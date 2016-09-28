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

    return maps.lazy.controller("ProjectFormController", function ($scope, $timeout, $routeParams, ProjectService, SpatialDataSourceService, GeoLayerService, DatasourceService, notify) {

        var baseMapsList = angular.copy(baseMapsConfig.baseMaps);
        var toolAndWidgetsList = angular.copy(toolsConfig);

        init();

        function init () {

            if ($routeParams.id) {
                getProjectById($routeParams.id).then(onSuccess, onError);
            }

            function onSuccess(response) {
                $scope.project = response.data;
                setSelectedBaseMaps();
                setAllToolsSelected();
                setAllWidgetsSelected();
            }

            function onError(err) {
                console.error(err);
            }

        }

        function getProjectById (id) {
            if (id) {
                return ProjectService.get(id);
            }
        }

        function setSelectedBaseMaps () {
            if ($scope.project.basemaps.length) {
                $scope.enableBaseMapSelector = true;
                baseMapsList.forEach( function (configBasemap) {
                    if ($scope.project.basemaps.indexOf(configBasemap.name) >= 0) {
                        configBasemap.checked = true;
                    }
                });
            }
        }

        function setAllWidgetsSelected() {
            for (var key in $scope.project.widgets) {
                if (!$scope.project.widgets[key]) {
                    $scope.allWidgetsAreEnabled = false;
                    break;
                }
                $scope.allWidgetsAreEnabled = true;
            }
        }

        function setAllToolsSelected() {

            var flag;

            for (var index in $scope.project.tools) {
                if (!$scope.project.tools[index].active) {
                    flag = false;
                    break;
                }
                flag = true;
            }

            $scope.allGeoToolsAreEnabled = flag;

        }

        $scope.setAllToolsSelected = setAllToolsSelected;
        $scope.setAllWidgetsSelected = setAllWidgetsSelected;

        $scope.project = {
            basemaps : [],
            widgets : {},
            tools : [],
            richLayers : [],
            serviceType : "connecta",
            mapConfig: {
                minZoom : 3,
                maxZoom : 13
            }
        };

        $scope.richLayer = {
            crossingKeys : {
                geoKey : {},
                resultSetkey : {}
            }
        };

        var WatcherEnum = {
            INITIAL_EXTENT: 'initialExtent',
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
                    $scope.project.mapConfig.initialExtent = mapHelper.getCenter();
                    $scope.$apply();
                    $scope.watchers[WatcherEnum.INITIAL_EXTENT] = mapHelper.watchCenterChange(function (position) {
                        $scope.project.mapConfig.initialExtent = position;
                        $scope.$apply();
                    }, true);

                    $scope.watchers[WatcherEnum.MIN_ZOOM] = mapHelper.watchZoomChange(function (zoom) {
                        $scope.project.mapConfig.minZoom = zoom;
                        $scope.$apply();
                    }, true);

                    $scope.watchers[WatcherEnum.MAX_ZOOM] = mapHelper.watchZoomChange(function (zoom) {
                        $scope.project.mapConfig.maxZoom = zoom;
                        $scope.$apply();
                    }, true);

                });
        };

        $scope.setCurrentWatcher = function (watcher) {

            if ($scope.currentWatcher) {
                $scope.watchers[$scope.currentWatcher].pause();
            }

            if (watcher === $scope.currentWatcher) {
                delete $scope.currentWatcher;
                return;
            }

            $scope.currentWatcher = watcher;

            if (watcher === WatcherEnum.INITIAL_EXTENT) {
                mapHelper.setCenter($scope.project.mapConfig.initialExtent);
            }
            if (watcher === WatcherEnum.MAX_ZOOM) {
                mapHelper.setZoom($scope.project.mapConfig.maxZoom);
            }
            if (watcher === WatcherEnum.MIN_ZOOM) {
                mapHelper.setZoom($scope.project.mapConfig.minZoom);
            }

            $scope.currentWatcher = watcher;
            $scope.watchers[$scope.currentWatcher].resume();

        };

        $scope.updateZoomConfig = function (sender) {
            if ($scope.currentWatcher === sender) {
                mapHelper.setZoom($scope.project.mapConfig[sender]);
            }
        };

        $scope.updateCenter = function () {
            if ($scope.currentWatcher === WatcherEnum.INITIAL_EXTENT) {
                $scope.watchers[$scope.currentWatcher].pause();
                mapHelper.setCenter($scope.project.mapConfig.initialExtent);
                $scope.watchers[$scope.currentWatcher].resume();
            }
        };

        $scope.currentStep = 1;

        $scope.steps = angular.copy(stepsConfig);

        $scope.baseMapThumbUrl = 'app/maps/project/template/_project_base_map_thumb.html';

        $scope.baseMaps = baseMapsList;

        $scope.tools = toolAndWidgetsList;

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
                for (var indexTool in sectionTools) {
                    if (!$scope.project[sectionName][indexTool]) {
                        $scope.project[sectionName][indexTool] = sectionTools[indexTool];
                    }
                    $scope.project[sectionName][indexTool].active = value;
                }
            } else {
                for (var tool in sectionTools) {
                    $scope.project[sectionName][tool] = value;
                }
            }

        };

        $scope.configSlider = {
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
        $scope.cancel = function () {
            $scope.flag_add = true;
        };

        $scope.editRichLayer = function (richLayer) {
            SpatialDataSourceService.list({size : "*"}).then(function (response) {
                $scope.spatialDataSources = response.data.content;
                return GeoLayerService.getLayersByDS(richLayer.layer.spatialDataSourceId);
            }, onError).then(function(response){
                $scope.layersBySpatials = response.data.content;
                return DatasourceService.listColumnsByDatasourceId(richLayer.dataSourceIdentifier);
            }, onError).then(function(response){
                $scope.columns = response.data.analysisColumns;
                $scope.getColumnsByLayer(richLayer.layer._id);
                $scope.flag_add = false;
                $scope.richLayerAdd = angular.copy(richLayer);
            });

            DatasourceService.listConnectaDatasources().then(onSuccesListDataSources, onError);
        };

        $scope.toggleOptionAdd = function (richLayer) {
            if (typeof richLayer == 'undefined') {
                $scope.richLayerAdd = {};
                $scope.layersBySpatials = [];
                $scope.columnsByLayer = [];
            }
            if ($scope.flag_add) {
                SpatialDataSourceService.list({size : "*"}).then(onSuccessListSpatialDS, onError);
                DatasourceService.listConnectaDatasources().then(onSuccesListDataSources, onError);

                if (richLayer) {
                    $scope.richLayerAdd = angular.copy(richLayer);
                    if (!$scope.flag_add)
                        return false;
                }

            } else {
                richLayer.resultSetId = richLayer.resultSetId || getResultSetId();
                $scope.project.richLayers.push(angular.copy(richLayer));
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
            console.log(id);
            if (id) {
                DatasourceService.listColumnsByDatasourceId(id).then(function (response) {
                    if (response.data) {
                        $scope.columns = response.data.analysisColumns;
                    }
                });
            }
        };

        function getResultSetId () {
            return btoa(String(Math.floor(Math.random()*1000 + Date.now()))).replace(/\=/g, '').substr(-7);
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

        function getCheckedBaseMaps () {

            var checkedBaseMaps = [];

            for (var index in $scope.baseMaps) {
                if ($scope.baseMaps[index].checked) {
                    checkedBaseMaps.push($scope.baseMaps[index].name);
                }
            }

            return checkedBaseMaps;

        }



//---------- [JS - PROJECT-FORM-LINK-DATASOURCE] -----------//

        $scope.saveProject = function () {

            $scope.project.basemaps = getCheckedBaseMaps();

            ProjectService.save($scope.project).then(onSuccess, onError);

            function onSuccess (response) {
                notify.success("Salvo");
            }

        };

    });

});
