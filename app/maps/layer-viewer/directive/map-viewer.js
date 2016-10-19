/* global angular */
define([
    'connecta.portal',
    'portal/layout/service/util',
    'maps/project/service/project-service',
    'presenter/analysis/service/analysis-service'
], function (portal) {
    return portal.lazy.directive('mapViewer', function (applications) {

        function mapController($scope, util, ProjectService, AnalysisService) {

            $scope.mapDivId = util.uuid();
            $scope.mapsClient = applications.maps.embedded;

            var promise = getElementById($scope.mapDivId);

            promise.then(onGetIFrame);

            /**
             *
             * @param {HTMLIFrameElement} iframe
             */
            function onGetIFrame(iframe) {

                ProjectService.get($scope.model.projectId).then( function (response) {
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
