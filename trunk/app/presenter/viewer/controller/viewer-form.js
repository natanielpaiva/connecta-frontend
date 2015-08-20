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
                $scope.getAnalysis = function (val) {
                    return ViewerService.getAnalysis(val);
                };
            },
            src: 'app/presenter/viewer/template/combo-analysis.html'
        });
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
            if (($scope.analysisViewer.metrics.length > 0 &&
                    $scope.analysisViewer.descriptions.length > 0) ||
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


    });
});
