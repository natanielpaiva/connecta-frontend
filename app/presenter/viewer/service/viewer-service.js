/* global angular */

define([
    'connecta.presenter',
    'portal/layout/service/autocomplete'
], function (presenter) {

    return presenter.lazy.service('ViewerService', function (presenterResources, $autocomplete, $http) {
        
        var types = {
            ANALYSIS: {
                type: 'ANALYSIS',
                icon: 'icon-analysis',
                template: "app/presenter/viewer/template/sidebar/_viewer-form-sidebar-analysis.html"
            },
            SINGLESOURCE: {
                type: 'SINGLESOURCE',
                icon: 'icon-image3',
                template: "app/presenter/viewer/template/sidebar/_viewer-form-sidebar-singlesource.html"
            },
            SINGLESOURCE_GROUP: {
                type: "SINGLESOURCE_GROUP",
                icon: 'icon-perm-media',
                template: ""
            }
        };

        var typeAmChart = {
            bar: [
                {
                    id: 'bar-two-value-axes',
                    src: '../../assets/img/presenter/barras/bar-two-value-axes.png'
                },
                {
                    id: 'bar-and-line',
                    src: '../../assets/img/presenter/barras/bar-and-line.png'
                },
                {
                    id: 'bar-clustered-3d',
                    src: '../../assets/img/presenter/barras/bar-clustered-3d.png'
                },
                {
                    id: 'bar-3d-bar',
                    src: '../../assets/img/presenter/barras/bar-3d-bar.png'
                }

            ],
            column: [
                {
                    id: 'column-using-custom-colors',
                    src: '../../assets/img/presenter/colunas/column-using-custom-colors.png'
                }
            ],
            area: [
                {
                    id: 'area-date-series-yearly',
                    src: '../../assets/img/presenter/area/area-date-series-yearly.png'
                }
            ]
            ,
            line: [
                {
                    id: 'line-stacked',
                    src: '../../assets/img/presenter/linhas/line-stacked.png'
                },
                {
                    id: 'line-rotate',
                    src: '../../assets/img/presenter/linhas/line-rotate.png'
                },
                {
                    id: 'line',
                    src: '../../assets/img/presenter/linhas/line.png'
                }
            ],
            'pie-donut': [
                {
                    id: 'pie',
                    src: '../../assets/img/presenter/circular/pie.png'
                },
                {
                    id: 'donut-3d',
                    src: '../../assets/img/presenter/circular/donut-3d.png'
                },
                {
                    id: 'donut',
                    src: '../../assets/img/presenter/circular/donut.png'
                }
            ]
        };

        var templateSidebar = [
            {
                type: "ANALYSIS",
                template: "/app/presenter/viewer/template/sidebar/_viewer-form-sidebar-analysis.html"
            },
            {
                type: "SINGLESOURCE",
                template: "/app/presenter/viewer/template/sidebar/_viewer-form-sidebar-singlesource.html"
            },
            {
                type: "SINGLESOURCE_GROUP",
                template: ""
            }
        ];


        var accordionConfig = [
            {
                heading: "VIEWER._APPEARANCE",
                title: "Appearance",
                type: "APPEARANCE",
                children: "",
                config: {
                    name: 'VIEWER.APPEARANCE',
                    template: 'app/presenter/viewer/template/appearance/appearance.html',
                    type: 'APPEARANCE'
                }

            },
            {
                heading: "VIEWER._BACKGROUND_AND_PLOT_AREA",
                title: "Background and plot area",
                type: "BACKGROUND",
                children: [
                    {
                        type: "PLOT_AREA",
                        name: "VIEWER.PLOT_AREA",
                        config: {
                            name: 'VIEWER.PLOT_AREA',
                            template: 'app/presenter/viewer/template/background-and-plot-area/plot-area.html',
                            type: 'PLOT_AREA'
                        }
                    },
                    {
                        type: "MARGINS",
                        name: "VIEWER.MARGINS",
                        config: {
                            name: 'VIEWER.MARGINS',
                            template: 'app/presenter/viewer/template/background-and-plot-area/margins.html',
                            type: 'MARGINS'
                        }
                    },
                    {
                        type: "BACKGROUND_AND_BORDER",
                        name: "VIEWER.BACKGROUND_AND_BORDER",
                        config: {
                            name: 'VIEWER.BACKGROUND_AND_BORDER',
                            template: 'app/presenter/viewer/template/background-and-plot-area/background-and-border.html',
                            type: 'BACKGROUND_AND_BORDER'
                        }
                    }
                ]

            },
            {
                heading: "VIEWER._GENERAL_SETTINGS",
                title: "VIEWER.GENERAL_SETTINGS",
                type: "GENERAL_SETTINGS",
                children: "",
                config: {
                    name: 'VIEWER.GENERAL_SETTINGS',
                    template: 'app/presenter/viewer/template/general-settings/general-settings.html',
                    type: 'GENERAL_SETTINGS'
                }
            },
            {
                heading: "VIEWER._MISCELLANEOUS",
                title: "VIEWER.MISCELLANEOUS",
                type: "MISCELLANEOUS",
                children: [
                    {
                        type: "OTHER",
                        name: "VIEWER.OTHER",
                        config: {
                            name: 'VIEWER.OTHER',
                            template: 'app/presenter/viewer/template/miscellaneous/other.html',
                            type: 'OTHER'
                        }
                    },
                    {
                        type: "COLUMNS",
                        name: "VIEWER.COLUMNS",
                        config: {
                            name: 'VIEWER.COLUMNS',
                            template: 'app/presenter/viewer/template/miscellaneous/columns.html',
                            type: 'COLUMNS'
                        }
                    },
                    {
                        type: "ZOOMING",
                        name: "VIEWER.ZOOMING",
                        config: {
                            name: 'VIEWER.ZOOMING',
                            template: 'app/presenter/viewer/template/miscellaneous/zooming.html',
                            type: 'ZOOMING'
                        }
                    },
                    {
                        type: "ANIMATION",
                        name: "VIEWER.ANIMATION",
                        config: {
                            name: 'VIEWER.ANIMATION',
                            template: 'app/presenter/viewer/template/miscellaneous/animation.html',
                            type: 'ANIMATION'
                        }
                    }
                ]
            },
            {
                heading: "VIEWER._NUMBER_FORMATTING",
                title: "Number formatting",
                type: "VIEWER.NUMBER_FORMATTING",
                children: "",
                config: {
                    name: 'VIEWER.NUMBER_FORMATTING',
                    template: 'app/presenter/viewer/template/number-formating/number-formating.html',
                    type: 'NUMBER_FORMATTING'
                }

            },
            {
                heading: "VIEWER._CHART_CURSOR",
                title: "VIEWER.CHART_CURSOR",
                type: "CHART_CURSOR",
                children: [
                    {
                        type: "GENERAL_SETTINGS",
                        name: "VIEWER.CHART_CURSOR",
                        config: {
                            name: 'VIEWER.CHART_CURSOR',
                            template: 'app/presenter/viewer/template/chart-cursor/general-settings.html',
                            type: 'GENERAL_SETTINGS'
                        }
                    },
                    {
                        type: "APPEARANCE",
                        name: "VIEWER.APPEARANCE",
                        config: {
                            name: 'VIEWER.APPEARANCE',
                            template: 'app/presenter/viewer/template/chart-cursor/appearance.html',
                            type: 'APPEARANCE'
                        }
                    }
                ]
            },
            {
                heading: "VIEWER._CHART_SCROLLBAR",
                title: "VIEWER.CHART_SCROLLBAR",
                type: "CHART_SCROLLBAR",
                children: [
                    {
                        type: "GENERAL_SETTINGS",
                        name: "VIEWER.GENERAL_SETTINGS",
                        config: {
                            name: 'VIEWER.GENERAL_SETTINGS',
                            template: 'app/presenter/viewer/template/chart-scrollbar/general-settings.html',
                            type: 'GENERAL_SETTINGS'
                        }
                    },
                    {
                        type: "APPEARANCE",
                        name: "VIEWER.APPEARANCE",
                        config: {
                            name: 'VIEWER.APPEARANCE',
                            template: 'app/presenter/viewer/template/chart-scrollbar/appearance.html',
                            type: 'APPEARANCE'
                        }
                    }
                ]
            },
            {
                heading: "VIEWER._LEGEND",
                title: "VIEWER.LEGEND",
                type: "LEGEND",
                children: [
                    {
                        type: "GENERAL_SETTINGS",
                        name: "VIEWER.GENERAL_SETTINGS",
                        config: {
                            name: 'VIEWER.GENERAL_SETTINGS',
                            template: 'app/presenter/viewer/template/legend/general-settings.html',
                            type: 'GENERAL_SETTINGS'
                        }
                    },
                    {
                        type: "POSITION_AND_MARGINS",
                        name: "VIEWER.POSITION_AND_MARGINS",
                        config: {
                            name: 'VIEWER.POSITION_AND_MARGINS',
                            template: 'app/presenter/viewer/template/legend/position-and-margins.html',
                            type: 'GENERAL_SETTINGS'
                        }
                    },
                    {
                        type: "APPEARANCE",
                        name: "VIEWER.APPEARANCE",
                        config: {
                            name: 'VIEWER.APPEARANCE',
                            template: 'app/presenter/viewer/template/legend/appearance.html',
                            type: 'APPEARANCE'
                        }
                    },
                    {
                        type: "MARKERS",
                        name: "VIEWER.MARKERS",
                        config: {
                            name: 'VIEWER.MARKERS',
                            template: 'app/presenter/viewer/template/legend/markers.html',
                            type: 'MARKERS'
                        }
                    }

                ]
            },
            {
                heading: "VIEWER._BALLON",
                title: "VIEWER.BALLON",
                type: "BALLON",
                children: [
                    {
                        type: "GENERAL_SETTINGS",
                        name: "VIEWER.GENERAL_SETTINGS",
                        config: {
                            name: 'VIEWER.GENERAL_SETTINGS',
                            template: 'app/presenter/viewer/template/ballon/general-settings.html',
                            type: 'GENERAL_SETTINGS'
                        }
                    },
                    {
                        type: "APPEARANCE",
                        name: "VIEWER.APPEARANCE",
                        config: {
                            name: 'VIEWER.APPEARANCE',
                            template: 'app/presenter/viewer/template/ballon/appearance.html',
                            type: 'APPEARANCE'
                        }
                    }

                ]

            },
            {
                heading: "VIEWER._TITLE",
                title: "VIEWER.TITLE",
                type: "TITLE",
                children: "",
                config: {
                    name: 'VIEWER.TITLE',
                    template: 'app/presenter/viewer/template/title/title.html',
                    type: 'TITLE'
                }

            },
            {
                heading: "VIEWER._GRAPHS",
                title: "VIEWER.GRAPHS",
                type: "GRAPHS",
                children: "",
                config: {
                    name: 'VIEWER.GRAPHS',
                    template: 'app/presenter/viewer/template/graphs/graphs.html',
                    type: 'GRAPHS'
                }

            }
        ];

        this.getTypeAmChart = function () {
            return typeAmChart;
        };

        this.getTemplateSidebar = function () {
            return templateSidebar;
        };

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

        this.getSinglesourceAutoComplete = function (value) {
            return $autocomplete(presenterResources.singlesource + "/auto-complete", {
                name: value
            }).then(function (response) {
                return response.data.map(function (item) {
                    return item;
                });
            });
        };

        this.getSinglesourceList = function (value) {
            return  $autocomplete(presenterResources.singlesource + "/auto-complete", {name: value})
                    .then(function (response) {
                        return response.data;
                    });
        };

        this.getSinglesource = function (id) {
            var url = presenterResources.singlesource + "/" + id;
            return $http.get(url);
        };

        this.getBinaryFile = function (singlesource) {
            return presenterResources.singlesource + '/' + singlesource.id + '/binary';
        };

        var filterAnalysisViewer = function (analysisViewer) {
            switch (analysisViewer.type) {
                case 'SINGLESOURCE':
                    for (var key in analysisViewer.singlesource.list) {
                        analysisViewer.singleSource.id = analysisViewer.singlesource.list[key].id;
                    }
                    delete analysisViewer.singlesource;
                    break;
                default:
                    for (key in analysisViewer.metrics) {
                        analysisViewer
                                .analysisViewerColumns
                                .push({
                                    columnDataType: 'NUMBER',
                                    columnType: 'METRIC',
                                    analysisColumn: analysisViewer.metrics[key]
                                }
                                );
                    }

                    for (key in analysisViewer.descriptions) {
                        analysisViewer
                                .analysisViewerColumns
                                .push({
                                    columnDataType: 'TEXT',
                                    columnType: 'DESCRIPTION',
                                    analysisColumn: analysisViewer.descriptions[key]
                                }
                                );
                    }

                    for (key in analysisViewer.xfields) {
                        analysisViewer
                                .analysisViewerColumns
                                .push({
                                    columnDataType: 'NUMBER',
                                    columnType: 'XFIELD',
                                    analysisColumn: analysisViewer.xfields[key]
                                }
                                );
                    }

                    for (key in analysisViewer.yfields) {
                        analysisViewer
                                .analysisViewerColumns
                                .push({
                                    columnDataType: 'NUMBER',
                                    columnType: 'YFIELD',
                                    analysisColumn: analysisViewer.yfields[key]
                                }
                                );
                    }

                    for (key in analysisViewer.valueFields) {
                        analysisViewer
                                .analysisViewerColumns
                                .push({
                                    columnDataType: 'NUMBER',
                                    columnType: 'VALUEFIELD',
                                    analysisColumn: analysisViewer.valueFields[key]
                                }
                                );
                    }
                    break;
            }


            delete analysisViewer.metrics;
            delete analysisViewer.descriptions;
            delete analysisViewer.yfields;
            delete analysisViewer.xfields;
            delete analysisViewer.valueFields;
        };
        this.save = function (analysisViewer) {

            var analysisViewerCopy = angular.copy(analysisViewer);
            var url = presenterResources.viewer;
            filterAnalysisViewer(analysisViewerCopy);
            if (analysisViewer.id === undefined) {
                return $http.post(url, analysisViewerCopy);
            } else {
                url = url + "/" + analysisViewer.id;
                return $http.put(url, analysisViewerCopy);
            }
        };
        this.preview = function (analysisViewer) {
            var analysisViewerCopy = angular.copy(analysisViewer);
            var url = presenterResources.viewer + "/preview";
            filterAnalysisViewer(analysisViewerCopy);
            return $http.post(url, analysisViewerCopy);
        };

        this.result = function (id) {
            var url = [
                presenterResources.viewer,
                id,
                "result"
            ].join("/");

            return $http.get(url);
        };

        this.getListAnalysis = function (analysisViewerData, analysisData) {
            analysisViewerData.analysisViewerColumns = [];
            for (var i in analysisData.analysisColumns) {
                analysisViewerData
                        .analysisViewerColumns
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
            var url = presenterResources.viewer;
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
            var url = presenterResources.viewer + "/" + id;
            return $http.get(url);
        };
        this.delete = function (id) {
            var url = presenterResources.viewer + "/" + id;
            return $http.delete(url);
        };
        this.getPreview = function (viewer, analysisViewerResult) {
            var viewerConfiguration = analysisViewerResult.analysisViewer.configuration;
            viewer.configuration = analysisViewerResult.analysisViewer.configuration;
            viewer.configuration.export = {enabled: true};
            if (viewerConfiguration.type !== "gauge") {
                viewer.configuration.data = analysisViewerResult.result;
            } else {
                viewer.configuration.arrows = [];
                for (var iResult in analysisViewerResult.result) {
                    for (var key in  analysisViewerResult.result[iResult]) {
                        var arrows = {
                            id: key,
                            value: analysisViewerResult.result[iResult][key],
                            color: '#' + (Math.random() * 0xFFFFFF << 0).toString(16)
                        };
                        viewer.configuration.arrows.push(arrows);
                    }
                }
            }

            switch (viewerConfiguration.type) {
                case "serial":
                    configureSerialAndRadar(viewer, analysisViewerResult);
                    break;
                case "radar":
                    configureSerialAndRadar(viewer, analysisViewerResult);
                    break;
                case "pie":
                    configureFunnelAndPie(viewer, analysisViewerResult);
                    break;
                case "funnel":
                    configureFunnelAndPie(viewer, analysisViewerResult);
                    break;
                case "xy":
                    var analysisViewerColumns = analysisViewerResult.analysisViewer.analysisViewerColumns;
                    var qtdXField = 0;
                    var qtdYField = 0;
                    var qtdValueField = 0;
                    for (var i in analysisViewerColumns) {
                        switch (analysisViewerColumns[i].columnType) {
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
                        viewer.configuration.graphs = [];
                        for (var l = 0; l < qtdXField; l++) {
                            var graphXy = angular.copy(standardGraph);
                            for (i in analysisViewerColumns) {
                                switch (analysisViewerColumns[i].columnType) {
                                    case'XFIELD':
                                        graphXy.xField = angular.copy(analysisViewerColumns[i].analysisColumn.label);
                                        break;
                                    case'YFIELD':
                                        graphXy.yField = angular.copy(analysisViewerColumns[i].analysisColumn.label);
                                        break;
                                    case'VALUEFIELD':
                                        graphXy.valueField = angular.copy(analysisViewerColumns[i].analysisColumn.label);
                                        break;
                                }
                            }
                            viewer.configuration.graphs.push(graphXy);
                        }
                    }

                    delete viewer.configuration.dataProvider;
                    break;
            }
        };
        var configureSerialAndRadar = function (viewer, analysisViewerResult) {
            var standardGraph = analysisViewerResult.analysisViewer.configuration.graphs[0];
            viewer.configuration.graphs = [];
            var analysisViewerColumns = analysisViewerResult.analysisViewer.analysisViewerColumns;
            for (var i in analysisViewerColumns) {
                if (analysisViewerColumns[i].columnType === 'DESCRIPTION') {
                    viewer.configuration.categoryField = analysisViewerColumns[i].analysisColumn.label;
                }

                if (analysisViewerColumns[i].columnType === 'METRIC') {
                    var graph = angular.copy(standardGraph);
                    graph.title = angular.copy(analysisViewerColumns[i].analysisColumn.label);
                    graph.valueField = angular.copy(analysisViewerColumns[i].analysisColumn.label);
                    viewer.configuration.graphs.push(graph);
                }

            }
            delete viewer.configuration.dataProvider;
        };
        var configureFunnelAndPie = function (viewer, analysisViewerResult) {
            var analysisViewerColumns = analysisViewerResult.analysisViewer.analysisViewerColumns;
            for (var i in analysisViewerColumns) {
                if (analysisViewerColumns[i].columnType === 'DESCRIPTION') {
                    viewer.configuration.titleField = analysisViewerColumns[i].analysisColumn.label;
                }
                if (analysisViewerColumns[i].columnType === 'METRIC') {
                    viewer.configuration.valueField = analysisViewerColumns[0].analysisColumn.label;
                }
            }
            delete viewer.configuration.dataProvider;
        };
        
        this.getTypes = function(){
            return types;
        };
        
        this.bulkRemove = function (viewers) {
            return $http.delete(presenterResources.viewer, {
                data: viewers.map(function (e) {
                    return e.id;
                }),
                headers: {
                    // WTF, saporra ta mandando text/plain
                    'Content-Type': 'application/json'
                }
            });
        };
    });
});
