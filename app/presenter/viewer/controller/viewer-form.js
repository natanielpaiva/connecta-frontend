/* global angular */
define([
    'connecta.presenter',
    'presenter/viewer/service/viewer-service',
    'presenter/analysis/service/analysis-service',
    'portal/dashboard/directive/viewer',
    'portal/layout/service/util',
    'presenter/viewer/directive/analysis-viewer',
    'presenter/viewer/directive/twitter-timeline-viewer',
    'presenter/viewer/directive/singlesource-viewer',
    'presenter/viewer/directive/singlesource-group-viewer',
    'presenter/viewer/directive/combined-viewer',
    'presenter/viewer/controller/modal-analysis',
    'bower_components/html2canvas/dist/html2canvas.min',
    'bower_components/html2canvas/dist/html2canvas',
    'bower_components/angular-ui-select/dist/select'

], function (presenter) {
    return presenter.lazy.controller('ViewerFormController', function ($scope, ViewerService, SidebarService, $routeParams, $location, $uibModal, AnalysisService, util) {
        $scope.state = {loaded: false};
        $scope.chartCursor = {ativo: false};
        $scope.chartScrollbar = {ativo: false};
        $scope.legend = {ativo: false};

        $scope.status = {
            open: false
        };

        $scope.viewer = {
            name: "",
            description: "",
            type: "ANALYSIS",
            analysisViewerColumns: [],
            metrics: [],
            descriptions: [],
            xfields: [],
            yfields: [],
            valueFields: [],
            columns: [],
            filters: []
        };

        $scope.changeStatus = function () {
            if ($scope.status.open) {
                $scope.status.open = false;
            } else {
                $scope.status.open = true;
            }
        };

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
                                if ($scope.search.results[key].type === 'FILE') {
                                    $scope.search.results[key].binaryFile = ViewerService.getBinaryFile($scope.search.results[key]);
                                }
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

        var sidebarAnalysisChartJs = function () {
            SidebarService.config({
                controller: function ($scope) {

                    ViewerService.analysisList().then(function (response) {
                        $scope.analysisList = response.data;
                    });

                    $scope.types = AnalysisService.getTypes();

                    $scope.analysisBar = "ANALYSIS";
                    $scope.typeBar = "TYPE";
                    $scope.settingsBar = "SETTINGS";
                    $scope.setLayoutConfiguration = false;

                    $scope.chartJsTypes = ViewerService.getChartJsTypes();

                    $scope.changeTypeChart = function (template, type) {
                        ViewerService.getTemplates(type, template).then(function (response) {
                            $scope.viewer.configuration = response.data;
                            getPreview();
                        });
                    };

                    $scope.accordionConfig = ViewerService.getAccordionConfig();
                    $scope.templateSidebar = ViewerService.getTemplateSidebar();

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

                    $scope.disabledLayoutConfig = function () {
                        $scope.setLayoutConfiguration = false;
                    };

                    initializeAnalysisWatch();

                    $scope.getAnalysisResult = function () {
                        return AnalysisService.execute({
                            analysis: $scope.viewer.analysis,
                            pagination: {count: 50, page: 1}
                        }).then(function (response) {
                            $uibModal.open({
                                animation: true,
                                templateUrl: 'app/presenter/viewer/template/_modal-analysis.html',
                                controller: 'ModalAnalysis',
                                size: 'lg',
                                backdrop: false,
                                resolve: {
                                    analysisResult: function () {
                                        return response.data;
                                    }
                                }
                            });
                        });
                    };

                    $scope.viewer = getViewer();

                    $scope.templateCombo = 'app/presenter/viewer/template/sidebar/_viewer-form-sidebar-analysis-combo.html';
                    $scope.templateSettings = 'app/presenter/viewer/template/sidebar/_viewer-form-sidebar-analysis-settings.html';
                    $scope.templateTypes = 'app/presenter/viewer/template/sidebar/_viewer-form-sidebar-analysis-types-chartjs.html';

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

                    $scope.configAnimationCallBack = function(enabled) {
                        if($scope.viewer.configuration.subtype !== 'pie' &&
                            $scope.viewer.configuration.subtype !== 'doughnut'){
                            if(!enabled){
                                ViewerService.createAnimationCallBack($scope.viewer.configuration.options);
                            }else{
                                ViewerService.removeAnimationCallBack($scope.viewer.configuration.options);
                            }
                        }
                    };

                    $scope.$watchCollection('viewer.configuration.colors', function(newValues) {
                        //convert object to hex
                        if($scope.viewer.configuration && $scope.viewer.configuration.colors){
                            angular.forEach($scope.viewer.configuration.colors, function (color, index) {
                                if(color !== null && typeof color === 'object'){
                                    $scope.viewer.configuration.colors[index] = $scope.rgb2hex(color);
                                }
                            });
                        }
                    });

                    $scope.rgb2hex = function(rgba){
                        if(rgba && rgba.backgroundColor){
                            rgb = rgba.backgroundColor.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
                            return (rgb && rgb.length === 4) ? "#" +
                                ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
                                ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
                                ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
                        }else{
                            return rgba;
                        }
                    };
                },
                src: 'app/presenter/viewer/template/sidebar/_viewer-form-sidebar.html'
            }).show();
        };

        var initializeAnalysisWatch = function() {
            $scope.$watch('viewer.analysis', function (newValue, oldValue) {
                if (newValue !== undefined) {
                    ViewerService.getAnalysisById(newValue.id).then(function (response) {
                        angular.extend($scope.viewer.analysis, response.data);
                        //Torna todos as columns filtraveis
                        if ($scope.viewer.analysis !== undefined &&
                                (oldValue === undefined || newValue.id !== oldValue.id)) {
                            //remove os atributos da analise
                            $scope.viewer.filters = [];
                            $scope.viewer.metrics = [];
                            $scope.viewer.descriptions = [];
                            $scope.viewer.xfields = [];
                            $scope.viewer.yfields = [];
                            $scope.viewer.valueFields = [];
                            $scope.viewer.columns = [];

                            angular.forEach($scope.viewer.analysis.analysisColumns, function (column) {
                                var colunaFiltravel = {
                                    analysisColumn: angular.copy(column),
                                    columnType: 'FILTER'
                                };
                                $scope.viewer.filters.push(colunaFiltravel);
                            });
                        }
                    });
                }
            });
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

        var _prepareForRequest = function (viewer) {
            var analysisCopy = angular.copy(viewer.analysis);
            analysisCopy.analysisColumns = [];

            var populateAnalysis = function (o) {
                analysisCopy.analysisColumns.push(o.analysisColumn);
            };

            angular.forEach(viewer.metrics, populateAnalysis);
            angular.forEach(viewer.descriptions, populateAnalysis);
            angular.forEach(viewer.xfields, populateAnalysis);
            angular.forEach(viewer.yfields, populateAnalysis);
            angular.forEach(viewer.valueFields, populateAnalysis);

            _prepareSave(viewer);

            return analysisCopy;
        };

        function populateDrillIfExists(viewer) {
            drill = {};
            if (viewer.analysis.hasDrill) {
                drill.columnsToSum = [];

                angular.forEach(viewer.analysisViewerColumns, function (column) {
                    if (column.columnType === "DESCRIPTION" &&
                            column.analysisColumn.orderDrill !== undefined) {
                        drill.columnToDrill = column.analysisColumn.name;
                    }
                });
                populateColumnsToSum(viewer, drill);
            }
            return drill;
        }

        function populateColumnsToSum(viewer, drill) {
            angular.forEach(viewer.analysisViewerColumns, function (column) {
                if (column.columnType === "METRIC") {
                    drill.columnsToSum.push(column.analysisColumn.name);
                }
            });
        }

        var _savePreparationStrategy = {
            ANALYSIS: function (viewer) {
                var columnTypes = {
                    METRIC: viewer.metrics,
                    DESCRIPTION: viewer.descriptions,
                    XFIELD: viewer.xfields,
                    YFIELD: viewer.yfields,
                    VALUEFIELD: viewer.valueFields,
//                    FILTER: viewer.filters,
                    COLUMN: viewer.columns
                };

                viewer.analysisViewerColumns = [];
                angular.forEach(columnTypes, function (type, key) {
                    angular.forEach(type, function (o) {
                        o.columnType = key;
                        viewer.analysisViewerColumns.push(o);
                    });
                });
            },
            SINGLESOURCE: function (viewer) {
                angular.extend(viewer.singleSource, viewer.singlesource.list[0]);
            },
            TWITTER_TIMELINE : function (viewer) {
                return viewer;
            }
        };

        var _prepareSave = function (viewer) {
            _savePreparationStrategy[viewer.type](viewer);
        };

        var getPreview = function () {
            var readyForPreview = ($scope.viewer.metrics.length > 0 &&
                    $scope.viewer.descriptions.length > 0) ||
                    ($scope.viewer.xfields.length > 0 &&
                            $scope.viewer.yfields.length > 0);

            if (readyForPreview || $scope.viewer.columns.length > 0) {
                AnalysisService.execute({
                    analysis: _prepareForRequest($scope.viewer),
                    drill: populateDrillIfExists($scope.viewer)
                }).then(function (response) {
                    if($scope.viewer.configuration.type === 'chartjs'){
                        ViewerService.getPreviewChartJs($scope.viewer, response.data);
                    }else{
                        ViewerService.getPreview($scope.viewer, response.data);
                    }
                    $scope.state.loaded = true;
                });
            }
        };


        $scope.submit = function () {
            _prepareSave($scope.viewer);
            ViewerService.save($scope.viewer).then(function (response) {
                if ($routeParams.dashborad) {
                    $location.path('dashboard/' + $routeParams.dashborad);
                } else {
                    $location.path('presenter/viewer/'+response.data.id);
                }
            });
        };

        if ($routeParams.template && $routeParams.type && $routeParams.analysis) {

            if($routeParams.template === 'other-singlesource'){
                $scope.viewer = {
                    singleSource: {id: ""},
                    singlesource: {list: []},
                    name: "",
                    description: "",
                    type: "SINGLESOURCE"
                };
                sidebarSinglesource();
            }else if ($routeParams.template === 'twitter-timeline'){
                $scope.viewer = {
                    name: "",
                    description: "",
                    type: "TWITTER_TIMELINE"
                };
            }else if($routeParams.type === 'chartjs'){
                sidebarAnalysisChartJs();
                ViewerService.getTemplates($routeParams.type, $routeParams.template).then(function (response) {
                    var dados = response.data;
                    $scope.viewer.configuration = dados;
                    load();
                });
            }

            ViewerService.getAnalysisById($routeParams.analysis).then(function (response) {
                $scope.viewer.analysis = response.data;
                //Torna todos as columns filtraveis
                if ($scope.viewer.analysis !== undefined &&
                        (oldValue === undefined || newValue.id !== oldValue.id)) {
                    //remove os atributos da analise
                    $scope.viewer.filters = [];
                    $scope.viewer.metrics = [];
                    $scope.viewer.descriptions = [];
                    $scope.viewer.xfields = [];
                    $scope.viewer.yfields = [];
                    $scope.viewer.valueFields = [];
                    $scope.viewer.columns = [];

                    angular.forEach($scope.viewer.analysis.analysisColumns, function (column) {
                        var colunaFiltravel = {
                            analysisColumn: angular.copy(column),
                            columnType: 'FILTER'
                        };
                        $scope.viewer.filters.push(colunaFiltravel);
                    });
                }
            });

            $scope.state.loaded = true;

        }
        else if ($routeParams.id) {
            ViewerService.getAnalysisViewer($routeParams.id).then(function (response) {
                angular.extend($scope.viewer, response.data);

                switch ($scope.viewer.type) {
                    case 'SINGLESOURCE':
                        $scope.viewer.singlesource = {list: []};
                        sidebarSinglesource();

                        ViewerService.getSinglesource($scope.viewer.singleSource.id).then(function (response) {
                            var data = response.data;
                            if (data.type === 'FILE') {
                                data.binaryFile = ViewerService.getBinaryFile(data);
                            }
                            $scope.viewer.singlesource.list.push(data);
                        });

                        break;
                    default:
                        var analysisViewerColumns = $scope.viewer.analysisViewerColumns;

                        var arrays = {
                            METRIC: $scope.viewer.metrics,
                            DESCRIPTION: $scope.viewer.descriptions,
                            XFIELD: $scope.viewer.xfields,
                            YFIELD: $scope.viewer.yfields,
                            VALUEFIELD: $scope.viewer.valueFields,
                            COLUMN: $scope.viewer.columns,
                            FILTER: $scope.viewer.filters
                        };

                        for (var k in analysisViewerColumns) {
                            var columnType = analysisViewerColumns[k].columnType;
                            arrays[columnType].push(analysisViewerColumns[k]);
                        }

                        sidebarAnalysisChartJs();

                        getPreview();
                        load();
                        break;
                }
            });
        } else if ($routeParams.template && $routeParams.type) {

            if($routeParams.template === 'other-singlesource'){
                $scope.viewer = {
                    singleSource: {id: ""},
                    singlesource: {list: []},
                    name: "",
                    description: "",
                    type: "SINGLESOURCE"
                };
                sidebarSinglesource();
            }else if ($routeParams.template === 'twitter-timeline'){
                $scope.viewer = {
                    name: "",
                    description: "",
                    type: "TWITTER_TIMELINE"
                };
            }else if($routeParams.type === 'chartjs'){
                sidebarAnalysisChartJs();
                ViewerService.getTemplates($routeParams.type, $routeParams.template).then(function (response) {
                    var dados = response.data;
                    $scope.viewer.configuration = dados;
                    load();
                });
            }

            $scope.state.loaded = true;
        }

        var defaultChartConfigs = function(){
            //Disable Animation
            $scope.viewer.configuration.startDuration = 0;
            angular.forEach($scope.viewer.configuration.titles, function (title) {
                title.text = '';
            });
            $scope.viewer.configuration.thousandsSeparator = '.';
            $scope.viewer.configuration.decimalSeparator = ',';
        };

        var __update = function (array) {
            if ($scope.state.loaded) {
                getPreview();
            }
//            angular.forEach(array, function(o){
//                o = { analysisColumn: o };
//
//                delete o.id;
//            });
        };

        var load = function () {
            $scope.$watchCollection('viewer.metrics', __update);
            $scope.$watchCollection('viewer.descriptions', __update);
            $scope.$watchCollection('viewer.xfields', __update);
            $scope.$watchCollection('viewer.yfields', __update);
            $scope.$watchCollection('viewer.valueFields', __update);
            $scope.$watchCollection('viewer.columns', __update);
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

        $scope.transformColumnDrop = function (item, columnType) {
            if (item.analysisColumn) {
                return item;
            } else {
                return {
                    analysisColumn: angular.copy(item),
                    columnType: columnType
                };
            }
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
