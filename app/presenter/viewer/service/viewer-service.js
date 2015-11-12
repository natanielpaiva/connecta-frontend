/* global angular */

define([
    'connecta.presenter',
    'portal/layout/service/autocomplete'
], function (presenter) {

    return presenter.lazy.service('ViewerService', function (presenterResources, $autocomplete, $http, $rootScope) {

        var accordionConfig = [
            {
                heading: "+ Appearance",
                title: "Appearance",
                type: "APPEARANCE",
                children: "",
                config: {
                    name: 'Appearance',
                    template: 'app/presenter/viewer/template/appearance/appearance.html',
                    type: 'APPEARANCE'
                }

            },
            {
                heading: "+ Background and plot area",
                title: "Background and plot area",
                type: "BACKGROUND",
                children: [
                    {
                        type: "PLOAT_AREA",
                        name: "PLOAT AREA",
                        config: {
                            name: 'PloatArea',
                            template: 'app/presenter/viewer/template/background-and-plot-area/plot-area.html',
                            type: 'PLOAT_AREA'
                        }
                    },
                    {
                        type: "MARGINS",
                        name: "MARGINS",
                        config: {
                            name: 'Margins',
                            template: 'app/presenter/viewer/template/background-and-plot-area/margins.html',
                            type: 'MARGINS'
                        }
                    },
                    {
                        type: "BACKGROUND_AND_BORDER",
                        name: "BACKGROUND AND BORDER",
                        config: {
                            name: 'Background',
                            template: 'app/presenter/viewer/template/background-and-plot-area/background-and-border.html',
                            type: 'BACKGROUND_AND_BORDER'
                        }
                    }
                ]

            },
            {
                heading: "+ General Settings",
                title: "General Settings",
                type: "GENERAL_SETTINGS",
                children: "",
                config: {
                    name: 'General S.',
                    template: 'app/presenter/viewer/template/general-settings/general-settings.html',
                    type: 'GENERAL_SETTINGS'
                }
            },
            {
                heading: "+ Miscellaneous",
                title: "Miscellaneous",
                type: "MISCELLANEOUS",
                children: [
                    {
                        type: "OTHER",
                        name: "OTHER",
                        config: {
                            name: 'Other',
                            template: 'app/presenter/viewer/template/miscellaneous/other.html',
                            type: 'OTHER'
                        }
                    },
                    {
                        type: "COLUMNS",
                        name: "COLUMNS",
                        config: {
                            name: 'Columns',
                            template: 'app/presenter/viewer/template/miscellaneous/columns.html',
                            type: 'COLUMNS'
                        }
                    },
                    {
                        type: "ZOOMING",
                        name: "ZOOMING",
                        config: {
                            name: 'Zooming',
                            template: 'app/presenter/viewer/template/miscellaneous/zooming.html',
                            type: 'ZOOMING'
                        }
                    },
                    {
                        type: "ANIMATION",
                        name: "ANIMATION",
                        config: {
                            name: 'Animation',
                            template: 'app/presenter/viewer/template/miscellaneous/animation.html',
                            type: 'ANIMATION'
                        }
                    }
                ]
            },
            {
                heading: "+ Number formatting",
                title: "Number formatting",
                type: "NUMBER_FORMATTING",
                children: "",
                config: {
                    name: 'Number f.',
                    template: 'app/presenter/viewer/template/number-formating/number-formating.html',
                    type: 'NUMBER_FORMATTING'
                }

            },
            {
                heading: "+ Chart cursor",
                title: "Chart cursor",
                type: "CHART_CURSOR",
                children: [
                    {
                        type: "GENERAL_SETTINGS",
                        name: "GENERAL SETTINGS",
                        config: {
                            name: 'General S.',
                            template: 'app/presenter/viewer/template/chart-cursor/general-settings.html',
                            type: 'GENERAL_SETTINGS'
                        }
                    },
                    {
                        type: "APPEARANCE",
                        name: "APPEARANCE",
                        config: {
                            name: 'Appearance',
                            template: 'app/presenter/viewer/template/chart-cursor/appearance.html',
                            type: 'APPEARANCE'
                        }
                    }
                ]
            },
            {
                heading: "+ Chart scrollbar",
                title: "Chart scrollbar",
                type: "CHART_SCROLLBAR",
                children: [
                    {
                        type: "GENERAL_SETTINGS",
                        name: "GENERAL SETTINGS",
                        config: {
                            name: 'General S.',
                            template: 'app/presenter/viewer/template/chart-scrollbar/general-settings.html',
                            type: 'GENERAL_SETTINGS'
                        }
                    },
                    {
                        type: "APPEARANCE",
                        name: "APPEARANCE",
                        config: {
                            name: 'Appearance',
                            template: 'app/presenter/viewer/template/chart-scrollbar/appearance.html',
                            type: 'APPEARANCE'
                        }
                    }
                ]
            },
            {
                heading: "+ Legend",
                title: "Legend",
                type: "LEGEND",
                children: [
                    {
                        type: "GENERAL_SETTINGS",
                        name: "GENERAL SETTINGS",
                        config: {
                            name: 'General S.',
                            template: 'app/presenter/viewer/template/legend/general-settings.html',
                            type: 'GENERAL_SETTINGS'
                        }
                    },
                    {
                        type: "POSITION_AND_MARGINS",
                        name: "POSITION AND MARGINS",
                        config: {
                            name: 'Position and M.',
                            template: 'app/presenter/viewer/template/legend/position-and-margins.html',
                            type: 'GENERAL_SETTINGS'
                        }
                    },
                    {
                        type: "APPEARANCE",
                        name: "APPEARANCE",
                        config: {
                            name: 'Appearance',
                            template: 'app/presenter/viewer/template/legend/appearance.html',
                            type: 'APPEARANCE'
                        }
                    },
                    {
                        type: "MARKERS",
                        name: "MARKERS",
                        config: {
                            name: 'Markers',
                            template: 'app/presenter/viewer/template/legend/markers.html',
                            type: 'MARKERS'
                        }
                    }

                ]
            },
            {
                heading: "+ Ballon",
                title: "Ballon",
                type: "BALLON",
                children: [
                    {
                        type: "GENERAL_SETTINGS",
                        name: "GENERAL SETTINGS",
                        config: {
                            name: 'General S.',
                            template: 'app/presenter/viewer/template/ballon/general-settings.html',
                            type: 'GENERAL_SETTINGS'
                        }
                    },
                    {
                        type: "APPEARANCE",
                        name: "APPEARANCE",
                        config: {
                            name: 'Appearance',
                            template: 'app/presenter/viewer/template/ballon/appearance.html',
                            type: 'APPEARANCE'
                        }
                    }

                ]

            },
            {
                heading: "+ Title",
                title: "Title",
                type: "TITLE",
                children: "",
                config: {
                    name: 'Title',
                    template: 'app/presenter/viewer/template/title/title.html',
                    type: 'TITLE'
                }

            },
            {
                heading: "+ Graphs",
                title: "Graphs",
                type: "GRAPHS",
                children: "",
                config: {
                    name: 'Graphs',
                    template: 'app/presenter/viewer/template/graphs/graphs.html',
                    type: 'GRAPHS'
                }

            }
        ];
        this.getAccordionConfig = function () {
            return accordionConfig;
        };
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

        this.getListAnalysis = function (analysisViewerData, analysisData) {
            analysisViewerData.analysisVwColumn = [];
            for (var i in analysisData.analysisColumns) {
                analysisViewerData
                        .analysisVwColumn
                        .push({
                            typeColumn: 'TEXT',
                            type: 'DESCRIPTION',
                            analysisColumn: analysisData.analysisColumns[i]
                        }
                        );
            }
            var url = presenterResources.analysisViewer + "/preview";
            return $http.post(url, analysisViewerData);
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
            if (viewerConfiguration.type !== "gauge") {
                analysisViewer.viewer.configuration.data = analysisViewerResult.result;
            } else {
                analysisViewer.viewer.configuration.arrows = [];
                for (var iResult in analysisViewerResult.result) {
                    for (var key in  analysisViewerResult.result[iResult]) {
                        var arrows = {
                            id: key,
                            value: analysisViewerResult.result[iResult][key],
                            color: '#' + (Math.random() * 0xFFFFFF << 0).toString(16)
                        };
                        analysisViewer.viewer.configuration.arrows.push(arrows);
                    }
                }
            }

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
