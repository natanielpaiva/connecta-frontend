define([
    'connecta.presenter',
    'presenter/viewer/service/viewer-service',
    'presenter/analysis/service/analysis-service',
    'portal/dashboard/directive/viewer',
    'presenter/viewer/directive/analysis-viewer',
    'presenter/viewer/directive/singlesource-viewer',
    'presenter/viewer/directive/singlesource-group-viewer',
    'presenter/viewer/directive/combined-viewer',
    'presenter/viewer/controller/modal-analysis',
    'bower_components/amcharts/dist/amcharts/exporting/canvg',
    'bower_components/amcharts/dist/amcharts/exporting/rgbcolor',
    'bower_components/html2canvas/dist/html2canvas.min',
    'bower_components/html2canvas/dist/html2canvas',
    'bower_components/angular-ui-select/dist/select'
], function (presenter) {
    return presenter.lazy.controller('ViewerViewController', function ($scope,
                                    ViewerService, $routeParams, AnalysisService, $location) {

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


        if ($routeParams.id) {
            ViewerService.getAnalysisViewer($routeParams.id).then(function (response) {
                angular.extend($scope.viewer, response.data);

                switch ($scope.viewer.type) {
                    case 'SINGLESOURCE':
                        $scope.viewer.singlesource = {list: []};
                        //sidebarSinglesource();

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
                        //sidebarAnalysis();
                        getPreview();
                        break;
                }
            });
        }

        $scope.excluir = function (id) {
            ViewerService.delete(id).then(function () {
                $location.path('presenter/viewer');
            });
        };
    });
});
