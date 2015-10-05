define([
    'connecta.presenter',
    'presenter/viewer/service/viewer-service',
    'presenter/viewer/controller/modal-analysis'
], function (presenter) {
    return presenter.lazy.controller('ViewerFormController', function ($scope, ViewerService, SidebarService, $routeParams, $location, LayoutService, $modal) {
        $scope.state = {loaded: false};
        $scope.chartCursor = {ativo: false};
        $scope.chartScrollbar = {ativo: false};
        $scope.legend = {ativo: false};

        $scope.metrics = [];
        $scope.descriptions = [];
        LayoutService.showSidebarRight(true);
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
                    ViewerService.getListAnalysis($scope.analysisViewerData, $scope.analysisData).then(function (response) {

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
                        console.log(response.data);
                    });
                };

                $scope.disabledLayoutConfig = function () {
                    $scope.setLayoutConfiguration = false;
                };

                $scope.setAnalysisData = function (analysisData) {
                    $scope.analysisData = analysisData;
                };

                $scope.viewer = getViewer();

                $scope.templateCombo = '/app/presenter/viewer/template/_combo.html';
                $scope.templateSettings = '/app/presenter/viewer/template/_settings.html';

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
            src: 'app/presenter/viewer/template/_settings-and-combo.html'
        });


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

        $scope.$on("$locationChangeStart", function (event) {
            LayoutService.showSidebarRight(false);
            SidebarService.config({
                controller: function () {
                }
            });
        });


        $scope.viewer = {
            "name": "",
            "description": "",
            "type" : "ANALYSIS",
            "analysisViewerColumns": [],
            "metrics": [],
            "descriptions": [],
            "xfields": [],
            "yfields": [],
            "valueFields": []
        };

        var getPreview = function () {
            if (($scope.viewer.metrics.length > 0) ||
                    ($scope.viewer.xfields.length > 0 &&
                            $scope.viewer.yfields.length > 0)) {
                ViewerService.preview($scope.viewer).then(function (response) {
                    ViewerService.getPreview($scope.viewer, response.data);
                }, function (response) {
                    console.log(response.data);
                });
            }
        };
        $scope.submit = function () {
            ViewerService.save($scope.viewer).then(function (response) {
                $location.path('presenter/viewer');
            });
        };


        if ($routeParams.id) {
            ViewerService.getAnalysisViewer($routeParams.id).then(function (response) {
                var data = response.data;
                $scope.viewer.configuration = data.configuration;
                $scope.viewer.name = data.name;
                $scope.viewer.description = data.description;
                $scope.viewer.id = data.id;
                var analysisColumns = data.analysisViewerColumns;
                
                var arrays = {
                    METRIC:$scope.viewer.metrics,
                    DESCRIPTION:$scope.viewer.descriptions,
                    XFIELD:$scope.viewer.xfields,
                    YFIELD:$scope.viewer.yfields,
                    VALUEFIELD:$scope.viewer.valueFields,
                };
                
                for (var k in analysisColumns) {
                    var columnType = analysisColumns[k].columnType;
                    arrays[columnType].push(analysisColumns[k].analysisColumn);
                }
                
                $scope.viewer.configuration = data.configuration;
                getPreview();
                load();
            }, function (response) {
                console.log(response.data);
            });
        } else {
            if ($routeParams.template && $routeParams.type) {
                ViewerService.getTemplates($routeParams.type, $routeParams.template)
                        .then(function (response) {
                            var dados = response.data;
                            dados.data = response.data.dataProvider;
                            $scope.viewer.configuration = dados;
                            load();
                        });
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
