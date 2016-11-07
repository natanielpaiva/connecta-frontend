/* global angular */
define([
    'connecta.presenter',
    'portal/layout/service/autocomplete'
], function (presenter) {
    return presenter.lazy.service('ViewerService', function (presenterResources, $autocomplete, $http, DomainService) {

        var exampleTable = {
            examples: [
                {
                    example1: 'example1',
                    example2: 'example2'
                },
                {
                    example1: 'example1',
                    example2: 'example2'
                },
                {
                    example1: 'example1',
                    example2: 'example2'
                },
                {
                    example1: 'example1',
                    example2: 'example2'
                }
            ]
        };

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
                    src: 'assets/img/presenter/barras/bar-two-value-axes.png'
                },
                {
                    id: 'bar-and-line',
                    src: 'assets/img/presenter/barras/bar-and-line.png'
                },
                {
                    id: 'bar-clustered-3d',
                    src: 'assets/img/presenter/barras/bar-clustered-3d.png'
                },
                {
                    id: 'bar-3d-bar',
                    src: 'assets/img/presenter/barras/bar-3d-bar.png'
                }

            ],
            column: [
                {
                    id: 'column-using-custom-colors',
                    src: 'assets/img/presenter/colunas/column-using-custom-colors.png'
                }
            ],
            area: [
                {
                    id: 'area-area',
                    src: 'assets/img/presenter/area/area-area.png'
                }
            ],
            line: [
                {
                    id: 'line-stacked',
                    src: 'assets/img/presenter/linhas/line-stacked.png'
                },
                {
                    id: 'line-rotate',
                    src: 'assets/img/presenter/linhas/line-rotate.png'
                },
                {
                    id: 'line',
                    src: 'assets/img/presenter/linhas/line.png'
                }
            ],
            'pie-donut': [
                {
                    id: 'pie',
                    src: 'assets/img/presenter/circular/pie.png'
                },
                {
                    id: 'donut-3d',
                    src: 'assets/img/presenter/circular/donut-3d.png'
                },
                {
                    id: 'donut',
                    src: 'assets/img/presenter/circular/donut.png'
                }
            ]
        };

        var templateSidebar = [
            {
                type: "ANALYSIS",
                template: "app/presenter/viewer/template/sidebar/_viewer-form-sidebar-analysis.html"
            },
            {
                type: "SINGLESOURCE",
                template: "app/presenter/viewer/template/sidebar/_viewer-form-sidebar-singlesource.html"
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

            },
            {
                heading: "VIEWER._CATEGORY_AXIS",
                title: "Category Axis",
                type: "CATEGORY_AXIS",
                children: "",
                config: {
                    name: 'VIEWER.CATEGORY_AXIS',
                    template: 'app/presenter/viewer/template/category-axis/axis-label.html',
                    type: 'CATEGORY_AXIS'
                }

            }
        ];

        this.getExampleTable = function () {
            return exampleTable;
        };

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

        this.getAnalysisById = function (id) {
            return $http.get(presenterResources.analysis + "/" + id);
        };

        this.analysisList = function () {
            return $http.get(presenterResources.analysis);
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

        this.save = function (analysisViewer) {
            var analysisViewerCopy = angular.copy(analysisViewer);
            var url = presenterResources.viewer;
//            filterAnalysisViewer(analysisViewerCopy);
            analysisViewerCopy.domain = DomainService.getDomainName();
            if (analysisViewer.id === undefined) {
                return $http.post(url, analysisViewerCopy);
            } else {
                url = url + "/" + analysisViewer.id;
                return $http.put(url, analysisViewerCopy);
            }
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
            var url = presenterResources.viewer + "/preview";
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

        this.getPreview = function (viewer, result) {
            viewer.configuration.colors = [ '#d80000', '#2f469a' , '#c6c6c6', '#132053'
            ];
            viewer.configuration.fontFamily = 'Arial';
            if (viewer.configuration.type !== "gauge") {
                viewer.configuration.data = result;
            } else {
                viewer.configuration.arrows = [];
                for (var iResult in result) {
                    for (var key in  result[iResult]) {
                        var arrows = {
                            id: key,
                            value: result[iResult][key],
                            color: '#' + (Math.random() * 0xFFFFFF << 0).toString(16)
                        };
                        viewer.configuration.arrows.push(arrows);
                    }
                }
            }

            switch (viewer.configuration.type) {
                case "table":
                    viewer.configuration.data = result;
                    break;
                case "serial":
                    configureSerialAndRadar(viewer, result);
                    break;
                case "radar":
                    configureSerialAndRadar(viewer, result);
                    break;
                case "pie":
                    configureFunnelAndPie(viewer, result);
                    break;
                case "funnel":
                    configureFunnelAndPie(viewer, result);
                    break;
                case "xy":
                    var analysisViewerColumns = viewer.analysisViewerColumns;
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
                        var standardGraph = angular.copy(viewer.configuration.graphs[0]);
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

        var configureSerialAndRadar = function (viewer, result) {
            var standardGraph = angular.copy(viewer.configuration.graphs[0]);
            viewer.configuration.graphs = [];
            var analysisViewerColumns = viewer.analysisViewerColumns;
            var typeViewer = identifyViewerType(viewer, result);
            var negativeValue = false;
            if (typeViewer.type === 2) {
                negativeValue = montaSerialType2(viewer, result, typeViewer, standardGraph);
            } else {
                for (var i in analysisViewerColumns) {
                    if (analysisViewerColumns[i].columnType === 'DESCRIPTION') {
                        viewer.configuration.categoryField = analysisViewerColumns[i].analysisColumn.label;
                    }

                    if (analysisViewerColumns[i].columnType === 'METRIC') {
                        var graph = angular.copy(standardGraph);
                        graph.title = angular.copy(analysisViewerColumns[i].analysisColumn.label);
                        graph.valueField = angular.copy(analysisViewerColumns[i].analysisColumn.label);
                        graph.id = angular.copy(analysisViewerColumns[i].analysisColumn.label);
                        graph.balloonText = "[[title]] de [[category]] : [[value]]";
                        viewer.configuration.graphs.push(graph);

                        //verifica se tem algum numero negativo para setar ou não a escala
                        for (var r in result) {
                            var labelMetric = analysisViewerColumns[i].analysisColumn.label;
                            var valueMetric;
                            var object = result[r];
                            for (var t in object) {
                                if (t === labelMetric) {
                                    valueMetric = object[t];
                                    if (valueMetric < 0) {
                                        negativeValue = true;
                                    }
                                }
                            }
                        }
                    }

                }
            }

            viewer.configuration.valueAxes.forEach(function (valueAxis) {
                valueAxis.title = "";
                if (!negativeValue)
                    valueAxis.minimum = 0;
                else
                    delete valueAxis.minimum;
            });

            delete viewer.configuration.dataProvider;
        };
        var configureFunnelAndPie = function (viewer, result) {
            var typeViewer = identifyViewerType(viewer, result);
            var analysisViewerColumns = viewer.analysisViewerColumns;


            if (viewer.configuration.legend) {
                viewer.configuration.legend.valueWidth = 100;
            } else {
                viewer.configuration.legend = {};
                viewer.configuration.legend.valueWidth = 100;
            }
            if (typeViewer.type === 2) {
                montaPieType2(viewer, result, typeViewer);
            } else {
                for (var i in analysisViewerColumns) {
                    if (analysisViewerColumns[i].columnType === 'DESCRIPTION') {
                        viewer.configuration.titleField = analysisViewerColumns[i].analysisColumn.label;
                    }
                    if (analysisViewerColumns[i].columnType === 'METRIC') {
                        viewer.configuration.valueField = analysisViewerColumns[0].analysisColumn.label;
                    }
                }
            }

            delete viewer.configuration.dataProvider;
        };


        var montaPieType2 = function (viewer, result, typeViewer) {
            viewer.configuration.data = [];
            var description = typeViewer.descriptionLabel;
            var value = "value";
            viewer.configuration.titleField = description;
            viewer.configuration.valueField = value;
            viewer.analysisViewerColumns.forEach(function (analysisViewerColumn) {
                if (analysisViewerColumn.columnType === 'METRIC') {
                    for (var r in result) {
                        var obj = {};
                        var labelMetric = analysisViewerColumn.analysisColumn.label;
                        var valueMetric;
                        var object = result[r];
                        for (var t in object) {
                            if (t === labelMetric) {
                                valueMetric = object[t];
                            }
                        }

                        if (valueMetric !== undefined) {
                            obj[description] = labelMetric;
                            obj.value = valueMetric;
                        }
                        viewer.configuration.data.push(obj);
                    }
                }
            });
        };

        var montaSerialType2 = function (viewer, result, typeViewer, standardGraph) {
            var negative;
            viewer.configuration.data = [];
            var description = typeViewer.descriptionLabel;
            var value = "value";
            viewer.configuration.categoryField = description;

            var graph = angular.copy(standardGraph);
            graph.title = description;
            graph.valueField = value;
            graph.id = description;
            graph.balloonText = "[[category]] de [[title]] : [[value]]";
            viewer.configuration.graphs.push(graph);

            viewer.analysisViewerColumns.forEach(function (analysisViewerColumn) {
                if (analysisViewerColumn.columnType === 'METRIC') {
                    for (var r in result) {
                        var obj = {};
                        var labelMetric = analysisViewerColumn.analysisColumn.label;
                        var valueMetric;
                        var object = result[r];
                        for (var t in object) {
                            if (t === labelMetric) {
                                valueMetric = object[t];
                            }
                        }

                        if (valueMetric !== undefined) {
                            obj[description] = labelMetric;
                            obj.value = valueMetric;
                            if (valueMetric < 0) {
                                negative = true;
                            }
                        }
                        viewer.configuration.data.push(obj);
                    }
                }
            });

            return negative;
        };

        var identifyViewerType = function (viewer, result) {
            var descriptionCount = 0;
            var metricCount = 0;
            var drillCount = 0;
            var descriptionLabel;
            viewer.analysisViewerColumns.forEach(function (analysisViewerColumn) {
                if (analysisViewerColumn.columnType === 'DESCRIPTION') {
                    descriptionCount++;
                    descriptionLabel = analysisViewerColumn.analysisColumn.label;
                } else if (analysisViewerColumn.columnType === 'METRIC') {
                    metricCount++;
                }
            });

            viewer.analysis.analysisColumns.forEach(function (analysisColumn) {
                if (analysisColumn.orderDrill !== undefined &&
                        analysisColumn.orderDrill !== '') {
                    drillCount++;
                }
            });

            if (metricCount > 1 && result.length === 1 && drillCount < 2) {
                return {
                    "type": 2,
                    "descriptionLabel": descriptionLabel
                };
            }

            return {"type": 1};
        };

        this.getTypes = function () {
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

        // ----------- Chart JS  ------------ //

        var chartJsTypes = {
            chartjs : [
                {
                    id: 'horizontal-bar-chartjs',
                    src: 'assets/img/presenter/barras/bar-clustered.png'
                },
                {
                    id: 'area-chartjs',
                    src: 'assets/img/presenter/area/area-area.png'
                },
                {
                    id: 'bubble-chartjs',
                    src: 'assets/img/presenter/xy/xy-markers.png'
                },
                {
                    id: 'donut-chartjs',
                    src: 'assets/img/presenter/circular/donut.png'
                },
                {
                    id: 'bar-chartjs',
                    src: 'assets/img/presenter/colunas/column-using-custom-colors.png'
                },
                {
                    id: 'line-chartjs',
                    src: 'assets/img/presenter/linhas/line.png'
                },
                {
                    id: 'pie-chartjs',
                    src: 'assets/img/presenter/circular/pie.png'
                },
                {
                    id: 'polar-area-chartjs',
                    src: 'assets/img/presenter/outros/other-polar.png'
                },
                {
                    id: 'radar-chartjs',
                    src: 'assets/img/presenter/outros/other-radar.png'
                }
            ]
        };

        this.getChartJsTypes = function () {
            return chartJsTypes;
        };

        this.getPreviewChartJs = function (viewer, result, columnDrill) {

            viewer.configuration.labels = [];
            viewer.configuration.series = [];
            viewer.configuration.data = [];

            switch (viewer.configuration.subtype) {
                case "bar":
                    configureBarLineAndRadarChartJs(viewer, result, columnDrill);
                    break;
                case "horizontalBar":
                    configureBarLineAndRadarChartJs(viewer, result, columnDrill);
                    break;
                case "line":
                    configureBarLineAndRadarChartJs(viewer, result, columnDrill);
                    break;
                case "pie":
                    configurePieDonutAndAreaChartJs(viewer, result, columnDrill);
                    break;
                case "doughnut":
                    configurePieDonutAndAreaChartJs(viewer, result, columnDrill);
                    break;
                case "polarArea":
                    configurePieDonutAndAreaChartJs(viewer, result, columnDrill);
                    break;
                case "radar":
                    configureBarLineAndRadarChartJs(viewer, result, columnDrill);
                    break;
                case "bubble":
                    configureBubbleChartJs(viewer,result);
                    break;
            }

        };

        var configureBarLineAndRadarChartJs = function (viewer, result, columnDrill) {

            if (columnDrill) {
                viewer.configuration.labels =
                    montaArrayChartJs(columnDrill.label, result);

                viewer.analysisViewerColumns.forEach(function (analysisViewerColumn) {
                    if (analysisViewerColumn.columnType === 'METRIC') {
                        var labelMetric = analysisViewerColumn.analysisColumn.label;
                        viewer.configuration.series.push(labelMetric);
                        viewer.configuration.data.push(montaArrayChartJs(labelMetric, result));
                    }
                });
            }else{
                viewer.analysisViewerColumns.forEach(function (analysisViewerColumn) {
                    if(analysisViewerColumn.columnType === 'DESCRIPTION'){
                       viewer.configuration.labels =
                            montaArrayChartJs(analysisViewerColumn.analysisColumn.label, result);
                    }else if (analysisViewerColumn.columnType === 'METRIC') {
                        var labelMetric = analysisViewerColumn.analysisColumn.label;
                        viewer.configuration.series.push(labelMetric);
                        viewer.configuration.data.push(montaArrayChartJs(labelMetric, result));
                    }
                });
            }
        };

        var configurePieDonutAndAreaChartJs = function (viewer, result, columnDrill) {

            if(!viewer.configuration.options) {
                viewer.configuration.options = {};
            }

            //configuração de porcentagem
            viewer
                .configuration
                    .options
                        .tooltips = {
                            callbacks: {
                                label: function(tooltipItem, data) {
                                    var allData = data.datasets[tooltipItem.datasetIndex].data;
                                    var tooltipLabel = data.labels[tooltipItem.index];
                                    var tooltipData = allData[tooltipItem.index];
                                    var total = 0;
                                    for (var i in allData) {
                                        total += allData[i];
                                    }
                                    var tooltipPercentage = Math.round((tooltipData / total) * 100);
                                    return tooltipLabel + ': ' + tooltipData + ' (' + tooltipPercentage + '%)';
                                }
                        }
                    };

            var typeViewer = identifyViewerType(viewer, result);

            if(typeViewer.type === 2){
                montaChartJsPieType2(viewer, result);
            }else{
                montaChartJsPie(viewer, result, columnDrill);
            }
        };

        var montaChartJsPieType2 = function(viewer, result){
            viewer.analysisViewerColumns.forEach(function (analysisViewerColumn) {
                if (analysisViewerColumn.columnType === 'METRIC') {
                    viewer.configuration.labels.push(
                        analysisViewerColumn.analysisColumn.label);
                    var labelMetric = analysisViewerColumn.analysisColumn.label;
                    viewer.configuration.data.push(retornaValueFromField(labelMetric, result));
                }
            });
        };

        var montaChartJsPie = function(viewer, result, columnDrill){
            if (columnDrill) {
                viewer.configuration.labels =
                    montaArrayChartJs(columnDrill.label, result);

                viewer.analysisViewerColumns.forEach(function (analysisViewerColumn) {
                    if (analysisViewerColumn.columnType === 'METRIC') {
                        var labelMetric = analysisViewerColumn.analysisColumn.label;
                        viewer.configuration.data = montaArrayChartJs(labelMetric, result);
                    }
                });
            } else {
                viewer.analysisViewerColumns.forEach(function (analysisViewerColumn) {
                    if(analysisViewerColumn.columnType === 'DESCRIPTION'){
                        viewer.configuration.labels =
                            montaArrayChartJs(analysisViewerColumn.analysisColumn.label, result);
                    }else if (analysisViewerColumn.columnType === 'METRIC') {
                        var labelMetric = analysisViewerColumn.analysisColumn.label;
                        viewer.configuration.data = montaArrayChartJs(labelMetric, result);
                    }
                });
            }
        };

        var configureBubbleChartJs = function(viewer, result) {

            var xField;
            var yField;
            var valueField;
            var descriptionField;

            viewer.analysisViewerColumns.forEach(function (analysisViewerColumn) {
                if(analysisViewerColumn.columnType === 'DESCRIPTION'){
                    descriptionField = analysisViewerColumn.analysisColumn.label;
                    viewer.configuration.series =
                        montaArrayChartJs(descriptionField, result);
                }else if (analysisViewerColumn.columnType === 'XFIELD') {
                    xField = analysisViewerColumn.analysisColumn.label;
                }else if (analysisViewerColumn.columnType === 'YFIELD') {
                    yField = analysisViewerColumn.analysisColumn.label;
                }else if (analysisViewerColumn.columnType === 'VALUEFIELD') {
                    valueField = analysisViewerColumn.analysisColumn.label;
                }
            });

            for(var i = 0; i < result.length; i++){
                if(!descriptionField)
                    viewer.configuration.series.push('Bubble-'+(i+1));
                viewer.configuration.data.push(montaArrayXYChartJs(xField,yField,valueField,result[i]));
            }
        };

        var montaArrayXYChartJs = function(xField,yField,valueField,result) {
            var array = [];
            var xyr = {};
            var object = result;
            for (var t in object) {
                if (t === xField) {
                    xyr.x = object[t];
                } else if (t === yField) {
                    xyr.y = object[t];
                } else if (t === valueField) {
                    xyr.r = object[t];
                }
            }
            array.push(!xyr.r ? xyr = {x:xyr.x,y:xyr.y,r:1} : xyr);
            return array;
        };

        var montaArrayChartJs = function(field, result) {
            var array = [];
            for (var r in result) {
                var valueField;
                var object = result[r];
                for (var t in object) {
                    if (t === field) {
                        valueField = object[t];
                    }
                }

                array.push(valueField);
            }
            return array;
        };

        var retornaValueFromField = function(field, result) {
            var valueField;

            for (var r in result) {
                var object = result[r];
                for (var t in object) {
                    if (t === field) {
                        valueField = object[t];
                        break;
                    }
                }
            }
            return valueField;
        };

    });
});
