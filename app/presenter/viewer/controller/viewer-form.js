define([
    'connecta.presenter',
    'presenter/viewer/service/viewer-service'
], function (presenter) {
    return presenter.lazy.controller('ViewerFormController', function ($scope, ViewerService, sidebarService, $routeParams, $location, LayoutService) {
        $scope.state = {loaded: false};

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
                
                $scope.layoutConfig = ViewerService.getLayoutConfig();
                
                $scope.viewerBar = "ANALYSIS";
                $scope.getAnalysis = function (val) {
                    return ViewerService.getAnalysis(val);
                };
                
                $scope.disabledLayoutConfig = function(){
                   $scope.setLayoutConfiguration = false;  
                };
                
                $scope.analysisViewer = getAnalysisViewer();
                
                $scope.templateCombo = '/app/presenter/viewer/template/_combo.html';
                $scope.templateSettings = '/app/presenter/viewer/template/_settings.html';
                
                $scope.setLayoutSettings = function(type){
                    $scope.indexLayoutConfig = type;
                    $scope.setLayoutConfiguration = true;
                };
                
                $scope.checkViewerBar = function (type) {
                    $scope.viewerBar = type;
                };

            },
            src: 'app/presenter/viewer/template/_settings-and-combo.html'
        });


        var getAnalysisViewer = function () {
            return $scope.analysisViewer;
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
