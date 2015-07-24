define([
    'connecta.presenter',
    'presenter/viewer/service/viewer-service'
], function (presenter) {
    return presenter.lazy.controller('ViewerFormController', function ($scope, ViewerService, sidebarService, $routeParams, $location, layoutService, $rootScope) {
        $scope.metrics = [];
        $scope.descriptions = [];
        layoutService.showSidebarRight(true);
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
            layoutService.showSidebarRight(false);
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
            "descriptions": []
        };
        
        var getPreview = function () {
            $scope.analysisViewer.viewer.configuration = $scope.serialColumn;
            if ($scope.analysisViewer.metrics.length > 0 && $scope.analysisViewer.descriptions.length > 0) {
                ViewerService.preview($scope.analysisViewer).then(function (response) {
                    $scope.serialColumn = response.data.analysisViewer.viewer.configuration;
                    var standardGraph = response.data.analysisViewer.viewer.configuration.graphs[0];
                    $scope.serialColumn.data = response.data.result;
                    $scope.serialColumn.graphs = [];
                    var analysisVwColumn = response.data.analysisViewer.analysisVwColumn;
                    for (var i in analysisVwColumn) {
                        if (analysisVwColumn[i].type === 'DESCRIPTION') {
                            $scope.serialColumn.categoryField = analysisVwColumn[i].analysisColumn.label;
                        }

                        if (analysisVwColumn[i].type === 'METRIC') {
                            var graph = standardGraph;
                            graph.title = analysisVwColumn[i].analysisColumn.label;
                            graph.valueField = analysisVwColumn[i].analysisColumn.label;
                            $scope.serialColumn.graphs.push(graph);
                        }

                    }
                    //$scope.serialColumn = newChart;
                    delete $scope.serialColumn.dataProvider;
                    $scope.$broadcast("amCharts.renderChart", $scope.serialColumn);
                    
                }, function (response) {
                    console.log(response.data);
                });
            }
        };
        $scope.submit = function () {
            $scope.analysisViewer.viewer.configuration = $scope.serialColumn;
            ViewerService.save($scope.analysisViewer).then(function (response) {
                $location.path('presenter/viewer');
            });
        };
        $scope.serialColumn = {
            "type": "serial",
            "path": "https://www.amcharts.com/lib/3/",
            "categoryField": "category",
            "startDuration": 1,
            "categoryAxis": {
                "gridPosition": "start"
            },
            "trendLines": [],
            "graphs": [
                {
                    "balloonText": "[[title]] of [[category]]:[[value]]",
                    "fillAlphas": 1,
                    "id": "AmGraph-1",
                    "title": "graph 1",
                    "type": "column",
                    "valueField": "column-1"
                },
                {
                    "balloonText": "[[title]] of [[category]]:[[value]]",
                    "fillAlphas": 1,
                    "id": "AmGraph-2",
                    "title": "graph 2",
                    "type": "column",
                    "valueField": "column-2"
                }
            ],
            "guides": [],
            "valueAxes": [
                {
                    "id": "ValueAxis-1",
                    "title": "Axis title"
                }
            ],
            "allLabels": [],
            "balloon": {},
            "legend": {
                "useGraphSettings": true
            },
            "titles": [
                {
                    "id": "Title-1",
                    "size": 15,
                    "text": "Chart Title"
                }
            ],
            "data": [
                {
                    "category": "category 1",
                    "column-1": 8,
                    "column-2": 5
                },
                {
                    "category": "category 2",
                    "column-1": 6,
                    "column-2": 7
                },
                {
                    "category": "category 3",
                    "column-1": 2,
                    "column-2": 3
                }
            ]
        };
        if ($routeParams.id) {
            ViewerService.getAnalysisViewer($routeParams.id).then(function (response) {
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
                }
                $scope.analysisViewer.viewer.configuration = response.data.viewer.configuration;
                $scope.serialColumn = response.data.viewer.configuration;
                getPreview();
            }, function (response) {
                console.log(response.data);
            });
        } else {
            if ($routeParams.template && $routeParams.type) {
                ViewerService.getTemplates($routeParams.type, $routeParams.template)
                        .then(function (response) {
                            var dados = response.data;
                            dados.data = response.data.dataProvider;
                            $scope.serialColumn = dados;
                            $scope.$broadcast("amCharts.renderChart", $scope.serialColumn);
                        });
            }
            $scope.analysisViewer.viewer.configuration = $scope.serialColumn;
        }
        
        $scope.$watchCollection('analysisViewer.metrics', function (newValue, oldValue) {
            getPreview();
        });
        $scope.$watchCollection('analysisViewer.descriptions', function (newValue, oldValue) {
            getPreview();
        });

    });
});
