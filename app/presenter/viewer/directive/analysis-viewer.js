/* global angular */
define([
    'connecta.portal',
    'portal/layout/service/util',
    'presenter/analysis/service/analysis-service',
    'presenter/viewer/service/viewer-service'
], function (portal) {
    return portal.lazy.directive('analysisViewer', function () {
        return {
            templateUrl: 'app/presenter/viewer/directive/template/analysis-viewer.html',
            scope: {
                model: '=ngModel',
                edit: '=?edit'
            },
            controller: function ($scope, ViewerService, AnalysisService, util) {
                $scope.m2a = util.mapToArray;

                $scope.filterOperators = {
                    EQUAL: {
                        order: 0,
                        icon: 'icon-filter-equal',
                        name: 'LAYOUT.FILTER.TYPE.EQUAL',
                        type: 'STRING'
                    },
                    NOT_EQUAL: {
                        order: 1,
                        icon: 'icon-filter-not-equal',
                        name: 'LAYOUT.FILTER.TYPE.NOT_EQUAL',
                        type: 'STRING'
                    },
                    LESS_THAN: {
                        order: 2,
                        icon: 'icon-filter-less-than',
                        name: 'LAYOUT.FILTER.TYPE.LESS_THAN',
                        type: 'NUMBER'
                    },
                    LESS_THAN_EQUAL: {
                        order: 3,
                        icon: 'icon-filter-less-than-equal',
                        name: 'LAYOUT.FILTER.TYPE.LESS_THAN_EQUAL',
                        type: 'NUMBER'
                    },
                    GREATER_THAN: {
                        order: 4,
                        icon: 'icon-filter-greater-than',
                        name: 'LAYOUT.FILTER.TYPE.GREATER_THAN',
                        type: 'NUMBER'
                    },
                    GREATER_THAN_EQUAL: {
                        order: 5,
                        icon: 'icon-filter-greater-than-equal',
                        name: 'LAYOUT.FILTER.TYPE.GREATER_THAN_EQUAL',
                        type: 'NUMBER'
                    },
                    BETWEEN: {
                        order: 6,
                        icon: 'icon-filter-between',
                        name: 'LAYOUT.FILTER.TYPE.BETWEEN',
                        type: 'INTERVAL'
                    },
                    IN: {
                        order: 7,
                        icon: 'icon-filter-in',
                        name: 'LAYOUT.FILTER.TYPE.IN',
                        type: 'ARRAY'
                    },
                    CONTAINS: {
                        order: 8,
                        icon: 'icon-filter-contains',
                        name: 'LAYOUT.FILTER.TYPE.CONTAINS',
                        type: 'STRING'
                    },
                    STARTS_WITH: {
                        order: 9,
                        icon: 'icon-filter-starts-with',
                        name: 'LAYOUT.FILTER.TYPE.STARTS_WITH',
                        type: 'STRING'
                    },
                    ENDS_WITH: {
                        order: 10,
                        icon: 'icon-filter-ends-with',
                        name: 'LAYOUT.FILTER.TYPE.ENDS_WITH',
                        type: 'STRING'
                    }
                };

                $scope.analysisExecuteRequest = {
                    analysis: null,
                    filters: []
                };

                $scope.getAnalysisResult = function () {
                    $scope.analysisExecuteRequest.filters = [];

                    angular.forEach($scope.model.analysisViewerColumns, function (column) {
                        if (column.columnType === "FILTER" && column.active) {
                            $scope.analysisExecuteRequest.filters.push({
                                operator: column.type, // o tipo do filtro
                                columnName: column.analysisColumn.name,
                                value: column.value
                            });
                        }
                    });

                    AnalysisService.execute($scope.analysisExecuteRequest).then(function (response) {
                        if ($scope.model.configuration.type === 'table') {
                            $scope.model.configuration.data = response.data;
                        } else {
                            $scope.model.configuration.dataProvider = response.data;
                            $scope.model.configuration.export = {enabled: true};
                        }
                    });
                };

                if ($scope.model.id !== undefined) {
                    ViewerService.getAnalysisViewer($scope.model.id).then(function (response) {
                        angular.extend($scope.model, response.data);
                        $scope.analysisExecuteRequest.analysis = $scope.model.analysis;

                        $scope.getAnalysisResult();
                    });
                }

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


                $scope.columnExample = '';
                $scope.columnsTable = [];
                $scope.$watchCollection('model.analysisViewerColumns', function (newValue, oldValue) {
                    if ($scope.model.configuration.type === 'table') {
                        $scope.columnsTable = {};
                        for (var key in newValue) {
                            $scope.columnExample = true;
                            if (newValue[key].columnType === 'METRIC')
                                $scope.columnsTable[key] = {value: newValue[key].analysisColumn.label};

                        }
                        if (isEmpty($scope.columnsTable)) {
                            $scope.columnExample = '';
                        }
                    }
                });

//                $scope.$watchCollection('model.analysisViewerColumns', function (newValue, oldValue) {
//                    $scope.columnsTable = {};
//                    for (var key in newValue) {
//                         $scope.columnExample = true;
//                        if(newValue[key].columnType === 'METRIC'){
//                            $scope.columnsTable[key] = {value: newValue[key].analysisColumn.label};
//                        }
//                    }
//                    if ($scope.columnsTable[0] === undefined) {
//                        $scope.columnExample = '';
//                    }
//                });

                $scope.exampleTable = ViewerService.getExampleTable();

            }
        };
    });
});
