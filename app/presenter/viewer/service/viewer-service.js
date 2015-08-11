/* global angular */

define([
    'connecta.presenter',
    'portal/layout/service/autocomplete'
], function (presenter) {

    return presenter.lazy.service('ViewerService', function (presenterResources, $autocomplete, $http, $rootScope) {
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
                            typeColumn: 'NUMBER',
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

            for (key in analysisViewer.xfields) {
                analysisViewer
                        .analysisVwColumn
                        .push({
                            typeColumn: 'NUMBER',
                            type: 'XFIELD',
                            analysisColumn: analysisViewer.xfields[key]
                        }
                        );
            }

            for (key in analysisViewer.yfields) {
                analysisViewer
                        .analysisVwColumn
                        .push({
                            typeColumn: 'NUMBER',
                            type: 'YFIELD',
                            analysisColumn: analysisViewer.yfields[key]
                        }
                        );
            }

            for (key in analysisViewer.valueFields) {
                analysisViewer
                        .analysisVwColumn
                        .push({
                            typeColumn: 'NUMBER',
                            type: 'VALUEFIELD',
                            analysisColumn: analysisViewer.valueFields[key]
                        }
                        );
            }

            delete analysisViewer.metrics;
            delete analysisViewer.descriptions;
            delete analysisViewer.yfields;
            delete analysisViewer.xfields;
            delete analysisViewer.valueFields;

        };

        this.save = function (analysisViewer) {

            var analysisViewerCopy = angular.copy(analysisViewer);
            var url = presenterResources.analysisViewer;

            filterAnalysisViewer(analysisViewerCopy);
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

        this.delete = function (id) {
            var url = presenterResources.analysisViewer + "/" + id;
            return $http.delete(url);
        };

        this.getPreview = function (analysisViewer, analysisViewerResult) {
            var viewerConfiguration = analysisViewerResult.analysisViewer.viewer.configuration;
            analysisViewer.viewer.configuration = analysisViewerResult.analysisViewer.viewer.configuration;
            analysisViewer.viewer.configuration.data = analysisViewerResult.result;
            switch (viewerConfiguration.type) {
                case "serial":
                    configureSerialAndRadar(analysisViewer, analysisViewerResult);
                    break;
                case "radar":
                    configureSerialAndRadar(analysisViewer, analysisViewerResult);
                    break;
                case "pie":
                    configureFunnelAndPie(analysisViewer, analysisViewerResult);
                    break;
                case "funnel":
                    configureFunnelAndPie(analysisViewer, analysisViewerResult);
                    break;
                case "xy":
                    var analysisVwColumn = analysisViewerResult.analysisViewer.analysisVwColumn;
                    var qtdXField = 0;
                    var qtdYField = 0;
                    var qtdValueField = 0;
                    for (var i in analysisVwColumn) {
                        switch (analysisVwColumn[i].type) {
                            case'XFIELD':
                                qtdXField++;
                                break;
                            case'YFIELD':
                                qtdYField++;
                                break;
                            case'VALUEFIELD':
                                qtdValueField++;
                                break;
                        }
                    }

                    if (qtdXField === qtdYField) {
                        var standardGraph = angular.copy(analysisViewerResult.analysisViewer.viewer.configuration.graphs[0]);
                        analysisViewer.viewer.configuration.graphs = [];
                        for (var l = 0; l < qtdXField; l++) {
                            var graphXy = angular.copy(standardGraph);
                            for (i in analysisVwColumn) {
                                switch (analysisVwColumn[i].type) {
                                    case'XFIELD':
                                        graphXy.xField = angular.copy(analysisVwColumn[i].analysisColumn.label);
                                        break;
                                    case'YFIELD':
                                        graphXy.yField = angular.copy(analysisVwColumn[i].analysisColumn.label);
                                        break;
                                    case'VALUEFIELD':
                                        graphXy.valueField = angular.copy(analysisVwColumn[i].analysisColumn.label);
                                        break;
                                }
                            }
                            analysisViewer.viewer.configuration.graphs.push(graphXy);
                        }
                    }

                    delete analysisViewer.viewer.configuration.dataProvider;
                    break;
            }
        };

        var configureSerialAndRadar = function (analysisViewer, analysisViewerResult) {
            var standardGraph = analysisViewerResult.analysisViewer.viewer.configuration.graphs[0];
            analysisViewer.viewer.configuration.graphs = [];
            var analysisVwColumn = analysisViewerResult.analysisViewer.analysisVwColumn;
            for (var i in analysisVwColumn) {
                if (analysisVwColumn[i].type === 'DESCRIPTION') {
                    analysisViewer.viewer.configuration.categoryField = analysisVwColumn[i].analysisColumn.label;
                }

                if (analysisVwColumn[i].type === 'METRIC') {
                    var graph = angular.copy(standardGraph);
                    graph.title = angular.copy(analysisVwColumn[i].analysisColumn.label);
                    graph.valueField = angular.copy(analysisVwColumn[i].analysisColumn.label);

                    analysisViewer.viewer.configuration.graphs.push(graph);
                }

            }
            delete analysisViewer.viewer.configuration.dataProvider;
        };

        var configureFunnelAndPie = function (analysisViewer, analysisViewerResult) {
            var analysisVwColumn = analysisViewerResult.analysisViewer.analysisVwColumn;

            for (var i in analysisVwColumn) {
                if (analysisVwColumn[i].type === 'DESCRIPTION') {
                    analysisViewer.viewer.configuration.titleField = analysisVwColumn[i].analysisColumn.label;
                }
                if (analysisVwColumn[i].type === 'METRIC') {
                    analysisViewer.viewer.configuration.valueField = analysisVwColumn[0].analysisColumn.label;
                }
            }
            delete analysisViewer.viewer.configuration.dataProvider;
        };

    });

});
