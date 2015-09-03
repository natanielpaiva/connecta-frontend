define([
    'connecta.presenter',
    'presenter/viewer/service/viewer-service',
    'presenter/viewer/controller/modal-analysis',
], function (presenter) {
    return presenter.lazy.controller('ViewerFormController', function ($scope, ViewerService, sidebarService, $routeParams, $location, LayoutService, $modal) {
        $scope.state = {loaded: false};
        $scope.chartCursor = {ativo:false};
        $scope.metrics = [];
        $scope.descriptions = [];
        LayoutService.showSidebarRight(true);
        sidebarService.config({
            controller: function ($scope) {
                $scope.analysis = "";
                $scope.analysisBar = "ANALYSIS";
                $scope.typeBar = "TYPE";
                $scope.settingsBar = "SETTINGS";
                $scope.setLayoutConfiguration = false;
                $scope.chartCursor = getChartCursor();

                $scope.accordionConfig = ViewerService.getAccordionConfig();

                $scope.changeChartCursor = function () {
                    if ($scope.chartCursor.ativo) {
                        $scope.analysisViewer.viewer.configuration.chartCursor = {
                            color: "#FFF"
                        };
                    } else {
                        delete $scope.analysisViewer.viewer.configuration.chartCursor;
                    }
                };

                $scope.viewerBar = "ANALYSIS";
                $scope.getAnalysis = function (val) {
                    return ViewerService.getAnalysis(val);
                };

                $scope.analysisViewerData = {
                    viewer: {name: "", description: ""},
                    analysisVwColumn: []
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

                $scope.analysisViewer = getAnalysisViewer();

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
//                    for (var type in types) {
//                        if ($scope.indexLayoutConfig !== undefined) {
//                            if (type === $scope.layoutConfig[$scope.indexLayoutConfig].type) {
//                                retorno = true;
//                            }
//                        }
//                    }
                    return retorno;
                };

            },
            src: 'app/presenter/viewer/template/_settings-and-combo.html'
        });


        var getAnalysisViewer = function () {
            return $scope.analysisViewer;
        };
        
        var getChartCursor = function(){
           return $scope.chartCursor;  
        };

        $scope.$on("$locationChangeStart", function (event) {
            LayoutService.showSidebarRight(false);
            sidebarService.config({
                controller: function () {
                }
            });
        });


        $scope.analysisViewer = {
            "viewer": {
                "name": "",
                "description": ""
            },
            "analysisVwColumn": [],
            "metrics": [],
            "descriptions": [],
            "xfields": [],
            "yfields": [],
            "valueFields": []
        };

        var getPreview = function () {
            if (($scope.analysisViewer.metrics.length > 0) ||
                    ($scope.analysisViewer.xfields.length > 0 &&
                            $scope.analysisViewer.yfields.length > 0)) {
                ViewerService.preview($scope.analysisViewer).then(function (response) {
                    ViewerService.getPreview($scope.analysisViewer, response.data);
                }, function (response) {
                    console.log(response.data);
                });
            }
        };
        $scope.submit = function () {
            ViewerService.save($scope.analysisViewer).then(function (response) {
                $location.path('presenter/viewer');
            });
        };


        if ($routeParams.id) {
            ViewerService.getAnalysisViewer($routeParams.id).then(function (response) {
                $scope.analysisViewer.viewer.configuration = response.data.viewer.configuration;
                $scope.analysisViewer.viewer.name = response.data.viewer.name;
                $scope.analysisViewer.viewer.description = response.data.viewer.description;
                $scope.analysisViewer.id = response.data.id;
                var analysisColumns = response.data.analysisVwColumn;
                for (var k in analysisColumns) {
                    if (analysisColumns[k].type === "METRIC") {
                        $scope.analysisViewer.metrics.push(analysisColumns[k].analysisColumn);
                    }
                    if (analysisColumns[k].type === "DESCRIPTION") {
                        $scope.analysisViewer.descriptions.push(analysisColumns[k].analysisColumn);
                    }
                    if (analysisColumns[k].type === "XFIELD") {
                        $scope.analysisViewer.xfields.push(analysisColumns[k].analysisColumn);
                    }
                    if (analysisColumns[k].type === "YFIELD") {
                        $scope.analysisViewer.yfields.push(analysisColumns[k].analysisColumn);
                    }
                    if (analysisColumns[k].type === "VALUEFIELD") {
                        $scope.analysisViewer.valueFields.push(analysisColumns[k].analysisColumn);
                    }
                }
                $scope.analysisViewer.viewer.configuration = response.data.viewer.configuration;
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
                            $scope.analysisViewer.viewer.configuration = dados;
                            load();
                        });
            }

        }

        var load = function () {
            $scope.$watchCollection('analysisViewer.metrics', function (newValue, oldValue) {
                getPreview();
            });
            $scope.$watchCollection('analysisViewer.descriptions', function (newValue, oldValue) {
                getPreview();
            });
            $scope.$watchCollection('analysisViewer.xfields', function (newValue, oldValue) {
                getPreview();
            });
            $scope.$watchCollection('analysisViewer.yfields', function (newValue, oldValue) {
                getPreview();
            });
            $scope.$watchCollection('analysisViewer.valueFields', function (newValue, oldValue) {
                getPreview();
            });
        };

        $scope.newInterval = function () {
            $scope.iLastInterval = $scope.analysisViewer.viewer.configuration.axes[0].bands.length - 1;

            var interval = {
                color: "#fff",
                startValue: $scope.analysisViewer.viewer.configuration.axes[0].bands[$scope.iLastInterval].endValue + 1,
                endValue: $scope.analysisViewer.viewer.configuration.axes[0].bands[$scope.iLastInterval].endValue + 2
            };

            $scope.analysisViewer.viewer.configuration.axes[0].bands.push(interval);

        };

        $scope.deleteInterval = function (intervalItem) {
            $scope.analysisViewer.viewer.configuration.axes[0].bands.splice(
                    $scope.analysisViewer.viewer.configuration.axes[0].bands.indexOf(intervalItem), 1
                    );
        };

        $scope.$watch('analysisViewer.viewer', function () {
            if ($scope.analysisViewer.viewer.configuration) {
                if ($scope.analysisViewer.viewer.configuration.type === "gauge") {
                    var ilastInterval = $scope.analysisViewer.viewer.configuration.axes[0].bands.length - 1;
                    $scope.analysisViewer.viewer.configuration.axes[0].endValue = angular.copy($scope.analysisViewer.viewer.configuration.axes[0].bands[ilastInterval].endValue);
                }
            }
        }, true);

    });
});
