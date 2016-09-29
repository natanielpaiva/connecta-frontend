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

    return maps.lazy.controller("ProjectFormController", function ($scope, $timeout, $location, $routeParams, ProjectService, SpatialDataSourceService, GeoLayerService, DatasourceService, notify) {

        var baseMapsList = angular.copy(baseMapsConfig.baseMaps);
        var toolAndWidgetsList = angular.copy(toolsConfig);

        init();

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
            INITIAL_EXTENT: 'center',
            MAX_ZOOM: 'maxZoom',
            MIN_ZOOM: 'minZoom',
            INITIAL_ZOOM: 'zoom'
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
                    $scope.watchers[WatcherEnum.INITIAL_EXTENT] = mapHelper.watchCenterChange(function (position) {
                        $scope.project.mapConfig.center = position;
                        $scope.$apply();
                    }, true);

                    $scope.watchers[WatcherEnum.INITIAL_ZOOM] = mapHelper.watchZoomChange(function (zoom) {
                        $scope.project.mapConfig.zoom = zoom;
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

                    if ($routeParams.id) {
                        mapHelper.setCenter($scope.project.mapConfig.center);
                        mapHelper.setZoom($scope.project.mapConfig.zoom);
                    } else {
                        $scope.project.mapConfig.center = mapHelper.getCenter();
                        $scope.project.mapConfig.zoom = mapHelper.getZoom();
                        $scope.$apply();
                    }

                });
        };

        $scope.setCurrentWatcher = function (watcher) {

            if ($scope.currentWatcher) {
                if (watcher === WatcherEnum.INITIAL_EXTENT) {
                    $scope.watchers[WatcherEnum.INITIAL_ZOOM].pause();
                }
                $scope.watchers[$scope.currentWatcher].pause();
            }

            if (watcher === $scope.currentWatcher) {
                delete $scope.currentWatcher;
                return;
            }

            $scope.currentWatcher = watcher;

            if (watcher === WatcherEnum.INITIAL_EXTENT) {
                mapHelper.map.setView($scope.project.mapConfig.center, $scope.project.mapConfig.zoom);
                $scope.watchers[WatcherEnum.INITIAL_ZOOM].resume();
            }
            if (watcher === WatcherEnum.MAX_ZOOM) {
                mapHelper.setZoom($scope.project.mapConfig.maxZoom);
            }
            if (watcher === WatcherEnum.MIN_ZOOM) {
                mapHelper.setZoom($scope.project.mapConfig.minZoom);
            }
            $scope.watchers[$scope.currentWatcher].resume();
        };

        $scope.updateZoomConfig = function (sender) {
            if ($scope.currentWatcher === sender) {
                mapHelper.setZoom($scope.project.mapConfig[sender]);
            } else if (sender === WatcherEnum.INITIAL_ZOOM) {
                $scope.watchers[WatcherEnum.INITIAL_EXTENT].pause();
                mapHelper.setZoom($scope.project.mapConfig[WatcherEnum.INITIAL_ZOOM]);
                $scope.watchers[WatcherEnum.INITIAL_EXTENT].resume();
            }
        };

        $scope.updateCenter = function () {
            if ($scope.currentWatcher === WatcherEnum.INITIAL_EXTENT) {
                $scope.watchers[$scope.currentWatcher].pause();
                mapHelper.setCenter($scope.project.mapConfig.center);
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
        $scope.index_edit = null;
        var richLayerOriginal;

        function returnRichLayerList () {
            if ($scope.index_edit !== null) {
                $scope.project.richLayers.splice($scope.index_edit, 0, richLayerOriginal);
            }
        }


        $scope.cancel = function () {
            returnRichLayerList();
            $scope.index_edit = null;
            $scope.flag_add = true;
        };

        $scope.editRichLayer = function (richLayer, index) {
            // if ($scope.index_edit != null && $scope.index_edit >= 0) {
            //     return;
            // }

            console.log(index);
            $scope.richLayerAdd = {};

            var copyRichLayer = angular.copy(richLayer);
            delete copyRichLayer.$$hashKey;

            $scope.removeRichLayer(index);
            if (JSON.stringify($scope.richLayerAdd) != JSON.stringify(copyRichLayer)) {
                returnRichLayerList();
            }

            richLayerOriginal = angular.copy(richLayer);
            delete richLayerOriginal.$$hashKey;
            $scope.index_edit = index;

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

        $scope.removeRichLayer = function (index) {
            $scope.project.richLayers.splice(index, 1);
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
                if ($scope.index_edit) {
                    $scope.project.richLayers.splice($scope.index_edit, 0, $scope.richLayerAdd);
                } else {
                    $scope.project.richLayers.push(angular.copy(richLayer));
                }
            }
            $scope.index_edit = null;
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
            if (id) {
                DatasourceService.listColumnsByDatasourceId(id).then(function (response) {
                    if (response.data) {
                        $scope.columns = response.data.analysisColumns;
                    }
                });
            }
        };

        $scope.setAllToolsSelected = setAllToolsSelected;

        $scope.setAllWidgetsSelected = setAllWidgetsSelected;

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
            console.error(error);
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

        function init () {

            if ($routeParams.id) {
                getProjectById($routeParams.id).then(onSuccess, onErrorGet);
            }

            function onSuccess(response) {
                $scope.project = response.data;
                setSelectedBaseMaps();
                setAllToolsSelected();
                setAllWidgetsSelected();
            }

            function onErrorGet(err) {
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



//---------- [JS - PROJECT-FORM-LINK-DATASOURCE] -----------//

        $scope.saveProject = function () {

            $scope.project.basemaps = getCheckedBaseMaps();

            ProjectService.save($scope.project).then(onSuccess, onError);

            function onSuccess (response) {
                notify.success("Registro salvo com sucesso.");
                $location.path('/maps/project');
            }

        };

    });

});
