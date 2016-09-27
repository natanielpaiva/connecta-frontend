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
                for (var indexTool in $scope.project[sectionName]) {
                    $scope.project[sectionName][indexTool].active = value;
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
        $scope.cancel = function () {
            $scope.flag_add = true;
        }

        $scope.editRichLayer = function (richLayer) {
            SpatialDataSourceService.list({size : "*"}).then(function (response) {
                $scope.spatialDataSources = response.data.content;
                return GeoLayerService.getLayersByDS(richLayer.spatialDatasource._id);
            }, onError).then(function(response){
                $scope.layersBySpatials = response.data.content;
                return DatasourceService.listColumnsByDatasourceId(richLayer.datasource.info.analysis.id);
            }, onError).then(function(response){
                $scope.columns = response.data.analysisColumns;
                $scope.getColumnsByLayer(richLayer.layer._id);
                $scope.flag_add = false;
                $scope.richLayerAdd = angular.copy(richLayer);
            });

            DatasourceService.listConnectaDatasources().then(onSuccesListDataSources, onError);
        }

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
            if (id) {
                DatasourceService.listColumnsByDatasourceId(id).then(function (response) {
                    if (response.data) {
                        $scope.columns = response.data.analysisColumns;
                    }
                });
            }
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


        $scope.project.richLayers = [
            {
                level : "1",
                title : "RichLayer Title",
                layer : {
                    title : "layerTitle"
                },
                drillLabels : {
                    up : "Drill UP",
                    down : "Drill DOWN"
                },
                resultSetId : "resultID",
                crossingKeys : {
                    geoKey : "geoKey",
                    resultSetKey : "resultSetKey"
                },
                info : {

                },
                dataSourceIdentifier : {
                   title : "DataSourceTitle"
                }
            },
            {
                level : "2",
                title : "RichLayer Title2",
                layer : {
                    title : "layerTitle2"
                },
                drillLabels : {
                    up : "Drill UP",
                    down : "Drill DOWN"
                },
                resultSetId : "resultID",
                crossingKeys : {
                    geoKey : "geoKey",
                    resultSetKey : "resultSetKey"
                },
                info : {

                },
                dataSourceIdentifier : {
                    title : "DataSourceTitle2"
                }
            },
            {
                "title": "lol",
                "spatialDatasource": {
                    "dsn": "http://arcgis.cds.com.br/arcgis/rest/services/CNJ/ESTABELECIMENTOS_PRISIONAIS_SP/MapServer",
                    "title": "FUNFA",
                    "serverType": "ArcGIS",
                    "_id": "48430",
                    "__v": 0
                },
                "layer": {
                    "__v": 0,
                    "_id": "57dff63d1ebc303b416ff73a",
                    "geometryField": {
                        "domain": null,
                        "alias": "Shape",
                        "type": "esriFieldTypeGeometry",
                        "name": "Shape"
                    },
                    "geometryType": "esriGeometryPolygon",
                    "isVector": true,
                    "layerIdentifier": "3",
                    "spatialDataSourceId": "48430",
                    "title": "FUNFA Layer",
                    "layerFields": [
                        {
                            "domain": null,
                            "alias": "OBJECTID",
                            "type": "esriFieldTypeOID",
                            "name": "OBJECTID"
                        },
                        {
                            "domain": null,
                            "alias": "Shape",
                            "type": "esriFieldTypeGeometry",
                            "name": "Shape"
                        },
                        {
                            "domain": null,
                            "length": 60,
                            "alias": "NM_MUNICIP",
                            "type": "esriFieldTypeString",
                            "name": "NM_MUNICIP"
                        },
                        {
                            "domain": null,
                            "length": 7,
                            "alias": "CD_GEOCMU",
                            "type": "esriFieldTypeString",
                            "name": "CD_GEOCMU"
                        },
                        {
                            "domain": null,
                            "length": 2,
                            "alias": "CD_UF",
                            "type": "esriFieldTypeString",
                            "name": "MAX_CD_UF"
                        },
                        {
                            "domain": null,
                            "alias": "SUM_Plan1__CAP",
                            "type": "esriFieldTypeDouble",
                            "name": "SUM_Plan1__CAP"
                        },
                        {
                            "domain": null,
                            "alias": "SUM_Plan1__POP",
                            "type": "esriFieldTypeDouble",
                            "name": "SUM_Plan1__POP"
                        },
                        {
                            "domain": null,
                            "alias": "MEAN_PERC_OCUP",
                            "type": "esriFieldTypeDouble",
                            "name": "MEAN_PERC_OCUP"
                        },
                        {
                            "domain": null,
                            "alias": "Shape_Length",
                            "type": "esriFieldTypeDouble",
                            "name": "Shape_Length"
                        },
                        {
                            "domain": null,
                            "alias": "Shape_Area",
                            "type": "esriFieldTypeDouble",
                            "name": "Shape_Area"
                        }
                    ]
                },
                "crossingKeys": {
                    "geoKey": "NM_MUNICIP",
                    "resultSetKey": "MUNICIPIO"
                },
                "dataSourceIdentifier": {
                    "serviceType": "connecta",
                    "info": {
                        "analysis": {
                            "id": 147,
                            "name": "sssssss",
                            "datasource": null,
                            "analysisColumns": null,
                            "analysisAttributes": null,
                            "analysisRelations": null,
                            "hasDrill": false,
                            "type": "DATABASE",
                            "domain": "28",
                            "table": "CMSP_TSE_PERFIL_ELEITORADO",
                            "requestType": "TABLE",
                            "cached": false
                        }
                    },
                    "title": "lol",
                    "description": "lool",
                    "_id": "57ea6ff21d84412407a103c2",
                    "__v": 0
                }
            }
        ];

    });

});
