/* global angular */

define([
    'connecta.presenter',
    'portal/layout/service/autocomplete'
], function (presenter) {

    return presenter.lazy.service('ViewerService', function (presenterResources, $autocomplete, $http) {
        this.getAnalysis = function (value) {
            return $autocomplete(presenterResources.analysis + "/autocomplete", {
                name: value
            }).then(function (response) {
                return response.data.map(function (item) {
                    return item;
                });
            });
        };

        var filterAnalysisViewer = function (analysisViewer) {

            for (var key in analysisViewer.metrics) {
                analysisViewer
                        .analysisVwColumn
                        .push({
                            typeColumn: 'TEXT',
                            type: 'METRIC',
                            analysisColumn: analysisViewer.metrics[key]
                        }
                        );
            }

            for (key in analysisViewer.descriptions) {
                analysisViewer
                        .analysisVwColumn
                        .push({
                            typeColumn: 'TEXT',
                            type: 'DESCRIPTION',
                            analysisColumn: analysisViewer.descriptions[key]
                        }
                        );
            }
            
            delete analysisViewer.metrics;
            delete analysisViewer.descriptions;

        };

        this.save = function (analysisViewer) {
            var analysisViewerCopy = angular.copy(analysisViewer);
            var url = presenterResources.viewer;

            filterAnalysisViewer(analysisViewerCopy);
            console.log(analysisViewerCopy);
            if (analysisViewer.id === undefined) {
                return $http.post(url, analysisViewerCopy);
            } else {
                return $http.put(url, analysisViewerCopy);
            }
        };
        
        this.preview = function (analysisViewer) {
            var analysisViewerCopy = angular.copy(analysisViewer);
            var url = presenterResources.viewer + "/preview";

            filterAnalysisViewer(analysisViewerCopy);
            console.log(analysisViewerCopy);
            if (analysisViewer.id === undefined) {
                return $http.post(url, analysisViewerCopy);
            } else {
                return $http.put(url, analysisViewerCopy);
            }
        };

    });

});
