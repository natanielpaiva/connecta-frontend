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
            var url = presenterResources.analysisViewer;

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
            var url = presenterResources.analysisViewer + "/preview";
            filterAnalysisViewer(analysisViewerCopy);
            return $http.post(url, analysisViewerCopy);
        };

        this.list = function (params) {
            var url = presenterResources.analysisViewer;
            return $http.get(url, {
                params: params
            });
        };

        this.getTemplates = function (type, template) {
            var url = '';
            if (type !== undefined && template !== undefined)
                url = presenterResources.viewer + "/chart-template/" + type + "/" + template;
            else
                url = presenterResources.viewer + "/chart-template";
            return $http.get(url);
        };
        
        this.getAnalysisViewer = function (id) {
            var url = presenterResources.analysisViewer + "/" + id;
            return $http.get(url);
        };
        
        this.delete= function(id){
            var url = presenterResources.analysisViewer + "/" +id;
            return $http.delete(url);
        };

    });

});
