/* global angular */
define([
    'connecta.portal',
    'portal/layout/service/util'
], function (portal) {
    return portal.lazy.directive('mapViewer', function (applications) {

        function mapController($scope, util) {

            $scope.mapDivId = util.uuid();
            $scope.mapsClient = applications.maps.embedded;

            var promise = getElementById($scope.mapDivId);
            promise.then(onGetIFrame);

            /**
             *
             * @param {HTMLIFrameElement} iframe
             */
            function onGetIFrame(iframe) {
                //TODO: consumir resultSets configurados e deverá passá los para o iframe antes de passar a view
                // iframe.contentWindow.postMessage({
                //     VIEW : $scope.model
                // });

                iframe.contentWindow.postMessage({
                    "view": "default",
                    "defaultSettings": {
                        "context": {
                            "1": {
                                "analyses": [
                                    {
                                        "_id": "2",
                                        "title": "Fecomercio Empresas",
                                        "spatialDataSourceId": "26",
                                        "enable": false,
                                        "currentType": "thematic",
                                        "configRenderer": {
                                            "thematic": {
                                                "unique": {
                                                    "values" : {
                                                        "ATIVA": {
                                                            fill: "#3ea20e"
                                                        },
                                                        "BAIXADA": {
                                                            fill: "#fe0000"
                                                        }
                                                    },
                                                    "classificationField" : "SITUACAO"
                                                }
                                            }
                                        },
                                        "opacity": 0.5,
                                        "where": "DATA_ABERT like '2000%' or DATA_ABERT like '%2000'"
                                    },
                                    {
                                        "_id": "1",
                                        "title": "Fecomercio Bairros",
                                        "spatialDataSourceId": "25",
                                        "enable": true,
                                        "currentType": "thematic",
                                        "configRenderer": {
                                            "thematic": {
                                                "fill": {
                                                    "classificationMethod": "jenks",
                                                    "classificationField": "Count_1",
                                                    "breakCount": 5,
                                                    "colorRamp": [
                                                        "#feeedf",
                                                        "#fcbe85",
                                                        "#fd8c3c",
                                                        "#e65407",
                                                        "#a63700"
                                                    ]
                                                }
                                            }
                                        },
                                        "opacity": 0.7
                                    }
                                ]
                            }
                        }
                    }
                }, '*');

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
