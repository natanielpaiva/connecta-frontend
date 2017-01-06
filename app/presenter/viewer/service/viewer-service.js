/* global angular */
define([
    'connecta.presenter',
    'portal/layout/service/autocomplete'
], function (presenter) {
    return presenter.lazy.service('ViewerService', function (presenterResources, $autocomplete, $http, DomainService, util, ChartJs) {

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
            },
            TWITTER_TIMELINE: {
                type: "TWITTER_TIMELINE",
                icon: "icon-twitter",
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

            }
            // {
            //     heading: "VIEWER._BACKGROUND_AND_PLOT_AREA",
            //     title: "Background and plot area",
            //     type: "BACKGROUND",
            //     children: [
            //         {
            //             type: "PLOT_AREA",
            //             name: "VIEWER.PLOT_AREA",
            //             config: {
            //                 name: 'VIEWER.PLOT_AREA',
            //                 template: 'app/presenter/viewer/template/background-and-plot-area/plot-area.html',
            //                 type: 'PLOT_AREA'
            //             }
            //         }
            //     ]
            // }
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
            chartjs: [
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

        this.getPreview = function (viewer, result) {
            viewer.configuration.data = result;
        };

        this.getPreviewChartJs = function (viewer, result, columnDrill) {

            viewer.configuration.colors = ['#d80000', '#2f469a' , '#c6c6c6', '#132053'];

            viewer.configuration.labels = [];
            viewer.configuration.series = [];
            viewer.configuration.data = [];
            if (!viewer.configuration.options) {
                viewer.configuration.options = {};
            }

            if(!viewer.configuration.options.tooltips ||
                viewer.configuration.options.tooltips.enabled){
                angular.merge(viewer.configuration.options, ChartJs.getOptions());
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
                    setAxisToFalse(viewer.configuration.options.scales);
                    configurePieDonutAndAreaChartJs(viewer, result, columnDrill);
                    break;
                case "doughnut":
                    setAxisToFalse(viewer.configuration.options.scales);
                    configurePieDonutAndAreaChartJs(viewer, result, columnDrill);
                    break;
                case "polarArea":
                    configurePieDonutAndAreaChartJs(viewer, result, columnDrill);
                    break;
                case "radar":
                    configureBarLineAndRadarChartJs(viewer, result, columnDrill);
                    break;
                case "bubble":
                    configureBubbleChartJs(viewer, result);
                    break;
            }

            animationCallBack(viewer);
        };

        var setAxisToFalse = function(scales){
            scales.yAxes[0].display = false;
            scales.xAxes[0].display = false;
        };

        var configureBarLineAndRadarChartJs = function (viewer, result, columnDrill) {

            //configuração de formatação
            viewer
                .configuration
                .options
                .tooltips.callbacks = {
                        label: function (tooltipItem, data) {
                            var allData = data.datasets[tooltipItem.datasetIndex].data;
                            var tooltipLabel = data.datasets[tooltipItem.datasetIndex].label;
                            var tooltipData = allData[tooltipItem.index];
                            return tooltipLabel + ': ' + util.formatNumber(tooltipData, 2, ',', '.');
                        }
                    };

            var typeViewer = identifyViewerType(viewer, result);

            if (typeViewer.type === 2) {
                montaChartJsLineType2(viewer, result);
            } else {
                montaChartJsLine(viewer, result, columnDrill);
            }
        };

        var montaChartJsLineType2 = function (viewer, result) {
            viewer.configuration.series.push(viewer.configuration.descriptionLabel);
            var newArray = [];
            viewer.analysisViewerColumns.forEach(function (analysisViewerColumn) {
                if (analysisViewerColumn.columnType === 'METRIC') {
                    viewer.configuration.labels.push(
                            analysisViewerColumn.analysisColumn.label);
                    var labelMetric = analysisViewerColumn.analysisColumn.label;
                    newArray.push(retornaValueFromField(labelMetric, result));
                }
            });
            viewer.configuration.data.push(newArray);
        };

        var montaChartJsLine = function(viewer, result, columnDrill) {
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
            } else {
                viewer.analysisViewerColumns.forEach(function (analysisViewerColumn) {
                    if (analysisViewerColumn.columnType === 'DESCRIPTION') {
                        viewer.configuration.descriptionLabel = analysisViewerColumn.analysisColumn.label;
                        viewer.configuration.labels =
                                montaArrayChartJs(analysisViewerColumn.analysisColumn.label, result);
                    } else if (analysisViewerColumn.columnType === 'METRIC') {
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
                .tooltips.callbacks = {
                        label: function (tooltipItem, data) {
                            var allData = data.datasets[tooltipItem.datasetIndex].data;
                            var tooltipLabel = data.labels[tooltipItem.index];
                            var tooltipData = allData[tooltipItem.index];
                            var total = 0;
                            for (var i in allData) {
                                total += allData[i];
                            }
                            var tooltipPercentage = Math.round((tooltipData / total) * 100);
                            return tooltipLabel + ': ' + util.formatNumber(tooltipData, 2, ',', '.') + ' (' + tooltipPercentage + '%)';
                        }
                    };

            var typeViewer = identifyViewerType(viewer, result);

            if (typeViewer.type === 2) {
                montaChartJsPieType2(viewer, result);
            } else {
                montaChartJsPie(viewer, result, columnDrill);
            }
        };

        var montaChartJsPieType2 = function (viewer, result) {
            viewer.analysisViewerColumns.forEach(function (analysisViewerColumn) {
                if (analysisViewerColumn.columnType === 'METRIC') {
                    viewer.configuration.labels.push(
                            analysisViewerColumn.analysisColumn.label);
                    var labelMetric = analysisViewerColumn.analysisColumn.label;
                    viewer.configuration.data.push(retornaValueFromField(labelMetric, result));
                }
            });
        };

        var montaChartJsPie = function (viewer, result, columnDrill) {
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
                    if (analysisViewerColumn.columnType === 'DESCRIPTION') {
                        viewer.configuration.descriptionLabel = analysisViewerColumn.analysisColumn.label;
                        viewer.configuration.labels =
                                montaArrayChartJs(analysisViewerColumn.analysisColumn.label, result);
                    } else if (analysisViewerColumn.columnType === 'METRIC') {
                        var labelMetric = analysisViewerColumn.analysisColumn.label;
                        viewer.configuration.series.push(labelMetric);
                        viewer.configuration.data = montaArrayChartJs(labelMetric, result);
                    }
                });
            }
        };

        var configureBubbleChartJs = function (viewer, result) {

            var xField;
            var yField;
            var valueField;
            var descriptionField;

            viewer.analysisViewerColumns.forEach(function (analysisViewerColumn) {
                if (analysisViewerColumn.columnType === 'DESCRIPTION') {
                    descriptionField = analysisViewerColumn.analysisColumn.label;
                    viewer.configuration.series =
                            montaArrayChartJs(descriptionField, result);
                } else if (analysisViewerColumn.columnType === 'XFIELD') {
                    xField = analysisViewerColumn.analysisColumn.label;
                } else if (analysisViewerColumn.columnType === 'YFIELD') {
                    yField = analysisViewerColumn.analysisColumn.label;
                } else if (analysisViewerColumn.columnType === 'VALUEFIELD') {
                    valueField = analysisViewerColumn.analysisColumn.label;
                }
            });

            for (var i = 0; i < result.length; i++) {
                if (!descriptionField)
                    viewer.configuration.series.push('Bubble-' + (i + 1));
                viewer.configuration.data.push(montaArrayXYChartJs(xField, yField, valueField, result[i]));
            }
        };

        var montaArrayXYChartJs = function (xField, yField, valueField, result) {
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
            array.push(!xyr.r ? xyr = {x: xyr.x, y: xyr.y, r: 1} : xyr);
            return array;
        };

        var montaArrayChartJs = function (field, result) {
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

        var retornaValueFromField = function (field, result) {
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


        var animationCallBack = function(viewer){
            if(!viewer.configuration.options.tooltips.enabled){
                this.createAnimationCallBack(viewer.configuration.options);
            }else{
                this.removeAnimationCallBack(viewer.configuration.options);
            }
        }.bind(this);

        this.createAnimationCallBack = function(viewerOptions) {
            var options = {
                events: false,
                hover: {
                    animationDuration: 0
                },
                animation: {
                    duration: 1,
                    onComplete: function() {
                        var ctx = this.chart.ctx;
                        ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontFamily, 'normal', Chart.defaults.global.defaultFontFamily);
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'bottom';

                        this.data.datasets.forEach(function(dataset) {
                            for (var i = 0; i < dataset.data.length; i++) {
                                var model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model,
                                    scale_max = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._yScale.maxHeight;
                                ctx.fillStyle = '#444';
                                var y_pos = model.y - 5;
                                // Make sure data value does not get overflown and hidden
                                // when the bar's value is too close to max value of scale
                                // Note: The y value is reverse, it counts from top down
                                if ((scale_max - model.y) / scale_max >= 0.93)
                                    y_pos = model.y + 20;
                                ctx.fillText(util.formatNumber(dataset.data[i], 2, ',', '.'), model.x, y_pos);
                            }
                        });
                    }
                }
            };

            angular.merge(viewerOptions, options);
        };

        this.removeAnimationCallBack = function(viewerOptions) {
            delete viewerOptions.events;
            delete viewerOptions.hover;
            delete viewerOptions.animation;
        };

    });
});
