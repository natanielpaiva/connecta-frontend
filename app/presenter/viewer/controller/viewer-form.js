/* global angular */
define([
    'connecta.presenter',
    'presenter/viewer/service/viewer-service',
    'portal/dashboard/directive/viewer',
    'portal/layout/service/util',
    'presenter/viewer/directive/analysis-viewer',
    'presenter/viewer/directive/singlesource-viewer',
    'presenter/viewer/directive/singlesource-group-viewer',
    'presenter/viewer/directive/combined-viewer',
    'presenter/viewer/controller/modal-analysis',
    'bower_components/amcharts/dist/amcharts/exporting/canvg',
    'bower_components/amcharts/dist/amcharts/exporting/rgbcolor',
    'bower_components/html2canvas/dist/html2canvas.min',
    'bower_components/html2canvas/dist/html2canvas' 
], function (presenter) {
    return presenter.lazy.controller('ViewerFormController', function ($scope, ViewerService, SidebarService, $routeParams, $location, LayoutService, $modal, util) {
        $scope.state = {loaded: false};
        $scope.chartCursor = {ativo: false};
        $scope.chartScrollbar = {ativo: false};
        $scope.legend = {ativo: false};

        $scope.metrics = [];
        $scope.descriptions = [];


        var sidebarSinglesource = function () {
            SidebarService.config({
                controller: function ($scope) {
                    $scope.templateSidebar = ViewerService.getTemplateSidebar();
                    $scope.viewer = getViewer();

                    $scope.setSinglesourceData = function (singlesourceData) {
                        $scope.singlesourceData = singlesourceData;
                        $scope.singlesourceList = [];
                        $scope.singlesourceList.push(singlesourceData);
                    };

                    $scope.getSinglesource = function (val) {
                        return ViewerService.getSinglesourceAutoComplete(val);
                    };

                    $scope.search = {
                        name: "",
                        results: []
                    };

                    $scope.search.doSearch = function () {
                        ViewerService.getSinglesourceList($scope.search.name).then(function (response) {
                            $scope.search.results = response;
                            for (var key in $scope.search.results) {
                                $scope.search.results[key].binaryFile = ViewerService.getBinaryFile($scope.search.results[key]);
                            }
                        });
                    };

                    $scope.$watch('search.name', function () {
                        $scope.search.doSearch();
                    });
                },
                src: 'app/presenter/viewer/template/sidebar/_viewer-form-sidebar.html'
            }).show();
        };

        var sidebarAnalysis = function () {

            SidebarService.config({
                controller: function ($scope) {
                    $scope.analysis = "";
                    $scope.analysisBar = "ANALYSIS";
                    $scope.typeBar = "TYPE";
                    $scope.settingsBar = "SETTINGS";
                    $scope.setLayoutConfiguration = false;
                    $scope.chartCursor = getChartCursor();
                    $scope.chartScrollbar = getChartScrollbar();
                    $scope.legend = getLegend();
                    ViewerService.getTemplates().then(function (response) {
                        $scope.templates = response.data;
                    });

                    $scope.changeTypeChart = function (template, type) {
                        ViewerService.getTemplates(type, template).then(function (response) {
                            var data = angular.copy($scope.viewer.configuration.data);
                            var titles = angular.copy($scope.viewer.configuration.titles);
                            var titleField = angular.copy($scope.viewer.configuration.titleField);
                            var valueField = angular.copy($scope.viewer.configuration.valueField);
                            var categoryField = angular.copy($scope.viewer.configuration.categoryField);
                            var graphs = angular.copy($scope.viewer.configuration.graphs);

                            $scope.viewer.configuration = response.data;
                            delete $scope.viewer.configuration.dataProvider;

                            $scope.viewer.configuration.data = data;
                            $scope.viewer.configuration.titles = titles;

                            if (response.data.type === 'serial') {
                                dataSerial(categoryField, graphs);
                            }
                            if (response.data.type === 'pie') {
                                dataPie(titleField, valueField);
                            }
                        });
                    };

                    var dataSerial = function (categoryField, graphs) {
                        $scope.viewer.configuration.categoryField = categoryField;
                        $scope.viewer.configuration.graphs = graphs;
                    };

                    var dataPie = function (titleField, valueField) {
                        $scope.viewer.configuration.titleField = titleField;
                        $scope.viewer.configuration.valueField = valueField;
                    };

                    $scope.typeAmChart = ViewerService.getTypeAmChart();

                    $scope.accordionConfig = ViewerService.getAccordionConfig();
                    $scope.templateSidebar = ViewerService.getTemplateSidebar();

                    $scope.changeChartCursor = function () {
                        if ($scope.chartCursor.ativo) {
                            $scope.viewer.configuration.chartCursor = {
                                color: "#FFF"
                            };
                        } else {
                            delete $scope.viewer.configuration.chartCursor;
                        }
                    };

                    $scope.changeChartScrollbar = function () {
                        if ($scope.chartScrollbar.ativo) {
                            $scope.viewer.configuration.chartScrollbar = {
                                color: "#FFF"
                            };
                        } else {
                            delete $scope.viewer.configuration.chartScrollbar;
                        }
                    };

                    $scope.changeLegend = function () {
                        if ($scope.legend.ativo) {
                            $scope.viewer.configuration.legend = {
                            };
                        } else {
                            delete $scope.viewer.configuration.legend;
                        }
                    };

                    $scope.viewerBar = "ANALYSIS";
                    $scope.getAnalysis = function (val) {
                        return ViewerService.getAnalysis(val);
                    };


                    $scope.analysisViewerData = {
                        name: "",
                        description: "",
                        type: "ANALYSIS",
                        analysisViewerColumns: []
                    };

                    $scope.getListAnalysis = function () {
                        ViewerService.getListAnalysis($scope.analysisViewerData, $scope.analysisDataView).then(function (response) {

                            $modal.open({
                                animation: true,
                                templateUrl: 'app/presenter/viewer/template/_modal-analysis.html',
                                controller: 'ModalAnalysis',
                                size: 'lg',
                                resolve: {
                                    analysisData: function () {
                                        return response.data.result;
                                    }
                                }

                            });

                        }, function (response) {
                        });
                    };

                    $scope.disabledLayoutConfig = function () {
                        $scope.setLayoutConfiguration = false;
                    };

                    $scope.setAnalysisData = function (analysisData) {
                        $scope.analysisData = analysisData;
                        $scope.analysisDataView = angular.copy(analysisData);
                    };

                    $scope.viewer = getViewer();

                    $scope.templateCombo = 'app/presenter/viewer/template/sidebar/_viewer-form-sidebar-analysis-combo.html';
                    $scope.templateSettings = 'app/presenter/viewer/template/sidebar/_viewer-form-sidebar-analysis-settings.html';
                    $scope.templateTypes = 'app/presenter/viewer/template/sidebar/_viewer-form-sidebar-analysis-types.html';

                    $scope.setLayoutSettings = function (config) {
                        $scope.layoutConfig = config;
                        $scope.setLayoutConfiguration = true;
                    };

                    $scope.checkViewerBar = function (type) {
                        $scope.viewerBar = type;
                    };

                    $scope.openedAccordion = 0;

                    $scope.openAccordion = function () {
                        var retorno = false;
                        return retorno;
                    };

                },
                src: 'app/presenter/viewer/template/sidebar/_viewer-form-sidebar.html'
            }).show();
        };

        var getViewer = function () {
            return $scope.viewer;
        };

        var getChartCursor = function () {
            return $scope.chartCursor;
        };

        var getChartScrollbar = function () {
            return $scope.chartScrollbar;
        };
        var getLegend = function () {
            return $scope.legend;
        };

        $scope.$on("$locationChangeStart", function () {
            SidebarService.hide();
        });

        var getPreview = function () {
            if (($scope.viewer.metrics.length > 0) ||
                    ($scope.viewer.xfields.length > 0 &&
                            $scope.viewer.yfields.length > 0)) {
                ViewerService.preview($scope.viewer).then(function (response) {
                    ViewerService.getPreview($scope.viewer, response.data);
                }, function (response) {
                });
            }
        };

        $scope.submit = function () {
            ViewerService.save($scope.viewer).then(function () {
                $location.path('presenter/viewer');
            });
        };

        $scope.viewer = {
            "name": "",
            "description": "",
            "type": "ANALYSIS",
            "analysisViewerColumns": [],
            "metrics": [],
            "descriptions": [],
            "xfields": [],
            "yfields": [],
            "valueFields": []
        };

        if ($routeParams.id) {
            ViewerService.getAnalysisViewer($routeParams.id).then(function (response) {

                var data = response.data;
                $scope.viewer.id = data.id;
                $scope.viewer.name = data.name;
                $scope.viewer.description = data.description;


                switch (data.type) {
                    case 'SINGLESOURCE':
                        $scope.viewer = {
                            singleSource: {id: data.singleSource.id},
                            singlesource: {list: []},
                            name: data.name,
                            description: data.description,
                            type: "SINGLESOURCE",
                            id: data.id
                        };
                        sidebarSinglesource();

                        ViewerService.getSinglesource(data.singleSource.id).then(function (response) {
                            var data = response.data;
                            data.binaryFile = ViewerService.getBinaryFile(data);
                            $scope.viewer.singlesource.list.push(data);
                        });

                        break;
                    default:

                        $scope.viewer.configuration = data.configuration;

                        var analysisColumns = data.analysisViewerColumns;

                        var arrays = {
                            METRIC: $scope.viewer.metrics,
                            DESCRIPTION: $scope.viewer.descriptions,
                            XFIELD: $scope.viewer.xfields,
                            YFIELD: $scope.viewer.yfields,
                            VALUEFIELD: $scope.viewer.valueFields,
                        };

                        for (var k in analysisColumns) {
                            var columnType = analysisColumns[k].columnType;
                            arrays[columnType].push(analysisColumns[k].analysisColumn);
                        }
                        sidebarAnalysis();
                        //$scope.viewer.configuration.export = {enabled: true, libs:{autoLoad:false}};
                        getPreview();
                        load();
                        break;
                }
            });
        } else {

            if ($routeParams.template && $routeParams.type) {
                switch ($routeParams.template) {
                    case "other-singlesource":
                        $scope.viewer = {
                            singleSource: {id: ""},
                            singlesource: {list: []},
                            name: "",
                            description: "",
                            type: "SINGLESOURCE"
                        };
                        sidebarSinglesource();
                        break;
                    default:
                        sidebarAnalysis();
                        ViewerService.getTemplates($routeParams.type, $routeParams.template)
                                .then(function (response) {
                                    var dados = response.data;
                                    dados.data = response.data.dataProvider;
                                    $scope.viewer.configuration = dados;
                                    load();
                                });
                        break;
                }

            }

        }

        var load = function () {
            $scope.$watchCollection('viewer.metrics', function (newValue, oldValue) {
                getPreview();
            });
            $scope.$watchCollection('viewer.descriptions', function (newValue, oldValue) {
                getPreview();
            });
            $scope.$watchCollection('viewer.xfields', function (newValue, oldValue) {
                getPreview();
            });
            $scope.$watchCollection('viewer.yfields', function (newValue, oldValue) {
                getPreview();
            });
            $scope.$watchCollection('viewer.valueFields', function (newValue, oldValue) {
                getPreview();
            });
        };

        $scope.newInterval = function () {
            var start = 0, end = 10;
            if ($scope.viewer.configuration.axes[0].bands.length) {
                var iLastInterval = $scope.viewer.configuration.axes[0].bands.length - 1;
                start = $scope.viewer.configuration.axes[0].bands[iLastInterval].endValue;
                end = $scope.viewer.configuration.axes[0].bands[iLastInterval].endValue + 10;
            }

            $scope.viewer.configuration.axes[0].bands.push({
                color: util.randomRgbColor(),
                startValue: start,
                endValue: end
            });
        };

        $scope.deleteInterval = function (intervalItem) {
            $scope.viewer.configuration.axes[0].bands.splice(
                    $scope.viewer.configuration.axes[0].bands.indexOf(intervalItem), 1
                    );
        };

        $scope.export = function (filename) {
            element = $('#analysis-viewer').append($('.amChartsLegend'));
            type = 'jpeg';
            isPdf = false;

            wrapper = element[0];
            svgs = wrapper.getElementsByTagName('svg');

            options = {
                ignoreAnimation: true,
                ignoreMouse: true,
                ignoreClear: true,
                ignoreDimensions: true,
                offsetX: 0,
                offsetY: 0
            };
            canvas = document.createElement('canvas');
            context = canvas.getContext('2d');
            counter = {
                height: 0,
                width: 0
            };

            function removeImages(svg) {
                startStr = '<image';
                stopStr = '</image>';
                stopStrAlt = '/>';
                start = svg.indexOf(startStr);
                match = '';

                if (start !== -1) {
                    stop = svg.slice(start, start + 1000).indexOf(stopStr);
                    if (stop !== -1) {
                        svg = removeImages(svg.slice(0, start) + svg.slice(start + stop + stopStr.length, svg.length));
                    } else {
                        stop = svg.slice(start, start + 1000).indexOf(stopStrAlt);
                        if (stop !== -1) {
                            svg = removeImages(svg.slice(0, start) + svg.slice(start + stop + stopStr.length, svg.length));
                        }
                    }
                }
                return svg;
            }

            canvas.height = wrapper.offsetHeight;
            canvas.width = wrapper.offsetWidth;
            context.fillStyle = '#ffffff';
            context.fillRect(0, 0, canvas.width, canvas.height);

            if (svgs.length > 0) {
                // Add SVGs
                for (var i = 0; i < svgs.length; i++) {
                    var container = svgs[i].parentNode;
                    var innerHTML = removeImages(container.innerHTML); // remove images from svg until its supported

                    options.offsetY = counter.height;
                    counter.height += container.offsetHeight;
                    counter.width = container.offsetWidth;
                    canvg(canvas, innerHTML, options);
                }

                var image = canvas.toDataURL('image/' + type);
                $scope.outputData(image, filename, isPdf);
                // Adiciona Legenda ao Container inicial da mesma
            } else {
                html2canvas([$('#analysis-viewer')[0]], {
                    useCORS: true
                }).then(function (canvas) {

                    var image = canvas.toDataURL("image/" + type);
                    image = image.replace('data:image/jpeg;base64,', '');
                    finalImageSrc = 'data:image/jpeg;base64,' + image;
                    $scope.outputData(finalImageSrc, filename, isPdf);
                });
            }
        };

        $scope.outputData = function (image, filename, isPdf) {
            var obj_url;
            if (isPdf) {

                var imgData = image;
                var doc = new jsPDF();
                doc.addImage(imgData, 'JPEG', 0, 0);
                // Saída como URI de Dados
                obj_url = doc.output('dataurlstring');
            } else {

                window.URL = window.webkitURL || window.URL;
                var image_data = atob(image.split(',')[1]);
                // Converter os dados binários em um Blob
                var arraybuffer = new ArrayBuffer(image_data.length);
                var view = new Uint8Array(arraybuffer);
                for (var i = 0; i < image_data.length; i++) {
                    view[i] = image_data.charCodeAt(i) & 0xff;
                }

                var oBuilder = new Blob([view], {type: 'application/octet-stream'});
                obj_url = window.URL.createObjectURL(oBuilder);
            }

            var a = $("<a/>");
            $("body").append(a);
            a[0].href = obj_url;
            a[0].download = filename;
            a[0].click();
            a.remove();
        };

        $scope.$watch('viewer', function () {
            if ($scope.viewer.configuration) {
                if ($scope.viewer.configuration.type === "gauge") {
                    if ($scope.viewer.configuration.axes[0].bands.length) {
                        var ilastInterval = $scope.viewer.configuration.axes[0].bands.length - 1;
                        $scope.viewer.configuration.axes[0].endValue = angular.copy($scope.viewer.configuration.axes[0].bands[ilastInterval].endValue);
                    }
                }
            }
        }, true);
    });
});