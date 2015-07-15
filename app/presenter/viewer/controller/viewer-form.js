define([
    'connecta.presenter',
    'presenter/viewer/service/viewer-service'
], function (presenter) {
    return presenter.lazy.controller('ViewerFormController', function ($scope, ViewerService, sidebarService, $location, $rootScope) {
        $scope.metrics = [];
        $scope.descriptions = [];
        sidebarService.config({
            controller: function ($scope) {
                $scope.analysis = "";
                $scope.getAnalysis = function (val) {
                    return ViewerService.getAnalysis(val);
                };

            },
            src: 'app/presenter/viewer/template/combo-analysis.html'
        }).show();

        $scope.analysisViewer = {
            "viewer": {
                "name": "",
                "description": ""
            },
            "analysisVwColumn": [],
            "metrics": [],
            "descriptions": []
        };

        $scope.$watchCollection('analysisViewer.metrics', function () {
            getPreview();
        });

        $scope.$watchCollection('analysisViewer.descriptions', function () {
            getPreview();
        });

        var getPreview = function () {
            ViewerService.preview($scope.analysisViewer).then(function (response) {
                var newChart = response.data.analysisViewer.viewer.configuration;
                newChart.data = response.data.result;
                newChart.graphs = [];
                var analysisVwColumn = response.data.analysisViewer.analysisVwColumn;
                for (var i in analysisVwColumn) {
                    if (analysisVwColumn[i].type === 'DESCRIPTION') {
                        newChart.categoryField = analysisVwColumn[i].analysisColumn.label;
                    }

                    if (analysisVwColumn[i].type === 'METRIC') {
                        var graph = {
                            "balloonText": "[[title]] do [[category]] : [[value]]",
                            "fillAlphas": 1,
                            "id": "AmGraph-1",
                            "title": analysisVwColumn[i].analysisColumn.label,
                            "type": "column",
                            "valueField": analysisVwColumn[i].analysisColumn.label
                        }
                        newChart.graphs.push(graph);
                    }

                }

                $scope.amChartOptions = newChart;
                $scope.$broadcast("amCharts.renderChart", $scope.amChartOptions);
            });
        };

        $scope.submit = function () {
            ViewerService.save($scope.analysisViewer).then(function (response) {
                var newChart = response.data.analysisViewer.viewer.configuration;
                newChart.data = response.data.result;
                newChart.graphs = [];
                var analysisVwColumn = response.data.analysisViewer.analysisVwColumn;
                for (var i in analysisVwColumn) {
                    if (analysisVwColumn[i].type === 'DESCRIPTION') {
                        newChart.categoryField = analysisVwColumn[i].analysisColumn.label;
                    }

                    if (analysisVwColumn[i].type === 'METRIC') {
                        var graph = {
                            "balloonText": "[[title]] do [[category]] : [[value]]",
                            "fillAlphas": 1,
                            "id": "AmGraph-1",
                            "title": analysisVwColumn[i].analysisColumn.label,
                            "type": "column",
                            "valueField": analysisVwColumn[i].analysisColumn.label
                        }
                        newChart.graphs.push(graph);
                    }

                }

                $scope.amChartOptions = "";
                $scope.amChartOptions = newChart;
                $scope.$broadcast("amCharts.renderChart", $scope.amChartOptions);
                //$location.path('presenter/viewer');
            }, function (response) {
            });
        };

        $scope.amChartOptions = {
            "type": "serial",
            "path": "https://www.amcharts.com/lib/3/",
            "categoryField": "batata",
            "startDuration": 1,
            "categoryAxis": {
                "gridPosition": "start"
            },
            "trendLines": [],
            "graphs": [{
                    "balloonText": "[[title]]",
                    "fillAlphas": 1,
                    "id": "AmGraph-1",
                    "title": "Metrica",
                    "type": "column",
                    "valueField": "column"
                }
            ],
            "guides": [],
            "valueAxes": [{
                    "id": "ValueAxis-1",
                    "title": "Axis title"
                }],
            "allLabels": [],
            "balloon": {},
            "legend": {
                "useGraphSettings": true
            },
            "titles": [{
                    "id": "Title-1",
                    "size": 15,
                    "text": "Chart Title"
                }],
            "data": [{
                    "batata": "asdfasfd",
                    "column": 8

                }, {
                    "batata": "category 2",
                    "column": 6
                }]
        };

//        $scope.$watch('amChartOptions', function (newValue, oldValue) {
//            console.log(newValue);
//            console.log(oldValue);
//        });

        $scope.analysisViewer.viewer.configuration = $scope.amChartOptions;
    });
});
