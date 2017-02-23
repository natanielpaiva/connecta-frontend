/* global angular */
define([
    'connecta.portal',
    'maps/helper/map',
    'portal/layout/service/util',
    'maps/project/service/project-service',
    'presenter/analysis/service/analysis-service'
], function (portal, leafletHelper) {

    var ConnectaMaps;

    return portal.lazy.directive('mapViewer', function (applications) {

        function mapController($scope, $rootScope, util, ProjectService, AnalysisService, $location) {

            var url = $location.$$absUrl;
            var mapHelper = Object.assign({}, leafletHelper);
            var routeIsChanged;
            var _instanceMaps;

            $scope.isCreatingOrEditing = (/edit/g.test(url) || /new/g.test(url));
            $scope.uuid = util.uuid();
            $scope.mapDivId = util.uuid();
            $scope.clientDomain = applications.maps.clientDomain;

            var changeRouteSuccess = $rootScope.$on("$routeChangeSuccess", function (event, next, current) {
                if (!(/edit/g.test(next.$$route.originalPath) || /new/g.test(next.$$route.originalPath))) {
                    routeIsChanged = true;
                    changeRouteSuccess();

                    if (_instanceMaps) {
                        // _instanceMaps.destroy();
                    }
                }
            });

            if (!$scope.isCreatingOrEditing) {
                initViewer();
            } else {
                $scope.initMap = function () {
                    setTimeout(function () {
                        var promise = mapHelper.buildMap('_mapDivProjectView' + $scope.mapDivId, {attributionControl: false, zoomControl: false});
                        promise.catch(function (err) {
                            notify.error(err.statusText);
                        });
                        promise.then(function (map) {
                            var timer = setInterval( function() {
                                if (routeIsChanged) {
                                    changeRouteSuccess();
                                    clearInterval(timer);
                                }
                                map.invalidateSize();
                            }, 500);
                        });
                    }, 10);
                };
            }

            function initViewer() {
                var project;
                var responses = [];

                ProjectService.get($scope.model.project._id)
                    .then( function (response) {
                        var promises = [];

                        project = response.data;

                        for (var index in project.richLayers) {
                            promises.push(AnalysisService.getAnalysis(project.richLayers[index].dataSourceIdentifier));
                        }

                        return Promise.all(promises);
                    })
                    .then( function (response) {
                        var index = 0;

                        return new Promise(function (resolve, reject) {
                            function execute() {
                                if (index === response.length) {
                                    resolve(responses);
                                } else {
                                    var promise = AnalysisService.execute(paramsFactory(project.richLayers[index], response[index].data));

                                    promise.then(function (result) {
                                        responses.push(result);
                                        index += 1;
                                        execute();
                                    }, reject);
                                }
                            }

                            execute();
                        });
                    })
                    .then( function (responses) {
                        var id;

                        if (ConnectaMaps) {
                            initConnectaMaps();
                        } else {
                            require(['ConnectaMaps', 'esri-leaflet'], initConnectaMaps);
                        }

                        function initConnectaMaps(a, esri) {
                            L.esri = esri;

                            if (!ConnectaMaps) {
                                ConnectaMaps = window.ConnectaMaps;
                            }

                            for (var index in responses) {
                                id = project.richLayers[index].resultSetId;
                                ConnectaMaps.MapsDataLoader.set(id, responses[index].data);
                            }

                            _instanceMaps = new ConnectaMaps(document.getElementById($scope.uuid), $scope.model._id, applications.maps.host);
                        }

                    });

                /**
                 * @param {
                 * {
                 * layer: Object,
                 * dataSourceIdentifier:String,
                 * title: String,
                 * drillLabels: {up: String, down: String},
                 * resultSetId: String,
                 * crossingKeys : { geoKey :  String, resultSetKey : String}
                 * }
                 * } richLayer
                 * @param {*} analysis
                 * @returns {{analysis: {}, filters: Array, drill: {columnToDrill: string, columnsToSum: Array, listPreviousColumns: *[]}}}
                 */
                function paramsFactory(richLayer, analysis){
                    return {
                        analysis : analysis,
                        filters : [],
                        drill : {
                            columnToDrill : richLayer.crossingKeys.resultSetKey,
                            columnsToSum : [],
                            listPreviousColumns : []
                        }
                    };

                    function mapOutFields() {
                        var outFields = [];
                        var filter = $scope.model.richLayersInfo.filter( function (item) {
                            return item.richLayerId === richLayer._id;
                        });
                        if (filter.length) {
                            outFields = filter[0].outFields.map( function (field) {
                                return field.name;
                            });
                        }

                        return outFields;
                    }
                }
            }
        }

        return {
            templateUrl: 'app/maps/layer-viewer/directive/template/map-viewer.html',
            controllerAs: "$ctrl",
            scope: {
                model: '=ngModel',
                height: '=?'
            },
            controller: mapController
        };
    });
});
