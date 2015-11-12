define([
    'connecta.presenter',
    'presenter/viewer/service/viewer-service',
    'portal/dashboard/directive/viewer',
    'presenter/viewer/directive/analysis-viewer',
    'presenter/viewer/directive/singlesource-viewer',
    'presenter/viewer/directive/singlesource-group-viewer',
    'presenter/viewer/directive/combined-viewer',
    'presenter/viewer/controller/modal-analysis'
], function (presenter) {
    return presenter.lazy.controller('ViewerFormController', function ($scope, ViewerService, SidebarService, $routeParams, $location, LayoutService, $modal) {
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

                    $scope.templateCombo = '/app/presenter/viewer/template/sidebar/_viewer-form-sidebar-analysis-combo.html';
                    $scope.templateSettings = '/app/presenter/viewer/template/sidebar/_viewer-form-sidebar-analysis-settings.html';

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

        $scope.$on("$locationChangeStart", function(){
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

            ViewerService.save($scope.viewer).then(function (response) {
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
                        $scope.viewer.configuration = data.configuration;
                        getPreview();
                        load();
                        break;
                }


            }, function (response) {
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
            $scope.iLastInterval = $scope.viewer.configuration.axes[0].bands.length - 1;

            var interval = {
                color: "#fff",
                startValue: $scope.viewer.configuration.axes[0].bands[$scope.iLastInterval].endValue + 1,
                endValue: $scope.viewer.configuration.axes[0].bands[$scope.iLastInterval].endValue + 2
            };

            $scope.viewer.configuration.axes[0].bands.push(interval);

        };

        $scope.deleteInterval = function (intervalItem) {
            $scope.viewer.configuration.axes[0].bands.splice(
                    $scope.viewer.configuration.axes[0].bands.indexOf(intervalItem), 1
                    );
        };

        $scope.$watch('viewer', function () {
            if ($scope.viewer.configuration) {
                if ($scope.viewer.configuration.type === "gauge") {
                    var ilastInterval = $scope.viewer.configuration.axes[0].bands.length - 1;
                    $scope.viewer.configuration.axes[0].endValue = angular.copy($scope.viewer.configuration.axes[0].bands[ilastInterval].endValue);
                }
            }
        }, true);

    });
});
