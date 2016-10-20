/* global angular */
define([
    'connecta.portal',
    'maps/helper/map',
    'portal/layout/service/util',
    'maps/project/service/project-service',
    'presenter/analysis/service/analysis-service'
], function (portal, leafletHelper) {
    return portal.lazy.directive('mapViewer', function (applications) {

        function mapController($scope, $rootScope, util, ProjectService, AnalysisService, $location) {

            var url = $location.$$absUrl;
            var mapHelper = Object.assign({}, leafletHelper);
            var routeIsChanged;

            $scope.isCreatingOrEditing = (/edit/g.test(url) || /new/g.test(url));
            $scope.mapIframeId = util.uuid();
            $scope.mapDivId = util.uuid();
            $scope.mapsClient = applications.maps.embedded;

            var changeRouteSuccess = $rootScope.$on("$routeChangeSuccess", function (event, next, current) {
                if (!(/edit/g.test(next.$$route.originalPath) || /new/g.test(next.$$route.originalPath))) {
                    routeIsChanged = true;
                }
            });

            if (!$scope.isCreatingOrEditing) {
                var promise = getElementById($scope.mapIframeId);
                promise.then(onGetIFrame);
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

            /**
             *
             * @param {HTMLIFrameElement} iframe
             */
            function onGetIFrame(iframe) {

                ProjectService.get($scope.model.project._id).then( function (response) {
                    var project = response.data,
                        promises = [];

                    for (var index in project.richLayers) {
                        promises.push(AnalysisService.getAnalysis(project.richLayers[index].dataSourceIdentifier));
                    }

                    Promise.all(promises).then( function (response) {
                        promises = [];

                        for (var index in response) {
                            promises.push(AnalysisService.execute(paramsFactory(project.richLayers[index], response[index].data)));
                        }

                        Promise.all(promises).then( function (responses) {
                            var id;

                            for (var index in responses) {
                                id = project.richLayers[index].resultSetId;

                                iframe.contentWindow.postMessage({
                                    "topicName" : "RESULT_SET",
                                    "data" : JSON.stringify({
                                        identifier : id,
                                        data : responses[index].data
                                    })
                                }, '*');

                            }

                            iframe.contentWindow.postMessage({
                                "topicName" : "VIEWER",
                                "data" : JSON.stringify($scope.model)
                            }, '*');

                        });

                    });

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
                            columnsToSum : $scope.model.richLayersInfo.filter( function (item) {
                                return item.richLayerId === richLayer._id;
                            })[0].outFields.map( function (field) {
                                return field.name;
                            }),
                            listPreviousColumns : []
                        }
                    };
                }
            }
        }

        /**
         *
         * @param id
         * @returns {Promise}
         */
        function getElementById(id) {
            return new Promise(function (resolve, reject) {
                var timer = setInterval(function () {
                    var element = document.getElementById(id);

                    if (element) {
                        resolve(element);
                        clearInterval(timer);
                    }
                }, 100);
            });
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
