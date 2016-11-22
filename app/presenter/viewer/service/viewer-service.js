/* global angular */
define([
    'connecta.presenter',
    'portal/layout/service/autocomplete'
], function (presenter) {
    return presenter.lazy.service('ViewerService', function (presenterResources, $autocomplete, $http, DomainService, util) {

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
                url = presenterResources.viewer + "/chart-template/chartjs";
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
            if(!viewer.configuration.options) {
                viewer.configuration.options = {};
            }

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

            //configuração de formatação
            viewer
                .configuration
                    .options
                        .tooltips = {
                            callbacks: {
                                label: function(tooltipItem, data) {
                                    var allData = data.datasets[tooltipItem.datasetIndex].data;
                                    var tooltipLabel = data.datasets[tooltipItem.datasetIndex].label;
                                    var tooltipData = allData[tooltipItem.index];
                                    return tooltipLabel + ': ' + util.formatNumber(tooltipData,2,',','.');
                                }
                        }
                    };

            if (columnDrill) {
                viewer.configuration.descriptionLabel = columnDrill.label;
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
                        viewer.configuration.descriptionLabel = analysisViewerColumn.analysisColumn.label;
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
                                    return tooltipLabel + ': ' + util.formatNumber(tooltipData,2,',','.') + ' (' + tooltipPercentage + '%)';
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
                viewer.configuration.descriptionLabel = columnDrill.label;
                viewer.configuration.labels =
                    montaArrayChartJs(columnDrill.label, result);

                viewer.analysisViewerColumns.forEach(function (analysisViewerColumn) {
                    if (analysisViewerColumn.columnType === 'METRIC') {
                        var labelMetric = analysisViewerColumn.analysisColumn.label;
                        viewer.configuration.series.push(labelMetric);
                        viewer.configuration.data = montaArrayChartJs(labelMetric, result);
                    }
                });
            } else {
                viewer.analysisViewerColumns.forEach(function (analysisViewerColumn) {
                    if(analysisViewerColumn.columnType === 'DESCRIPTION'){
                        viewer.configuration.descriptionLabel = analysisViewerColumn.analysisColumn.label;
                        viewer.configuration.labels =
                            montaArrayChartJs(analysisViewerColumn.analysisColumn.label, result);
                    }else if (analysisViewerColumn.columnType === 'METRIC') {
                        var labelMetric = analysisViewerColumn.analysisColumn.label;
                        viewer.configuration.series.push(labelMetric);
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
