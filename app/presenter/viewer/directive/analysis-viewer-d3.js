/* global angular */
define([
    'connecta.portal',
    'portal/layout/service/util',
    'portal/layout/directive/click-out',
    'portal/layout/service/export-file',
    'presenter/analysis/service/analysis-service',
    'presenter/viewer/service/viewer-service'
], function (portal) {
    return portal.lazy.directive('analysisViewer', function (ExportFile, $routeParams) {
        return {
            templateUrl: 'app/presenter/viewer/directive/template/analysis-viewer-d3.html',
            scope: {
                model: '=ngModel',
                edit: '=?edit'
            },
            controller: function ($scope, ViewerService, AnalysisService, util) {

            $scope.options = {
                    chart: {
                        type: 'lineChart',
                        height: 450,
                        margin : {
                            top: 20,
                            right: 20,
                            bottom: 40,
                            left: 55
                        },
                        x: function(d){ return d.x; },
                        y: function(d){ return d.y; },
                        useInteractiveGuideline: true,
                        dispatch: {
                            stateChange: function(e){ console.log("stateChange"); },
                            changeState: function(e){ console.log("changeState"); },
                            tooltipShow: function(e){ console.log("tooltipShow"); },
                            tooltipHide: function(e){ console.log("tooltipHide"); }
                        },
                        xAxis: {
                            axisLabel: 'Time (ms)'
                        },
                        yAxis: {
                            axisLabel: 'Voltage (v)',
                            tickFormat: function(d){
                                return d3.format('.02f')(d);
                            },
                            axisLabelDistance: -10
                        },
                        callback: function(chart){
                            console.log("!!! lineChart callback !!!");
                        }
                    },
                    title: {
                        enable: true,
                        text: 'Title for Line Chart'
                    },
                    subtitle: {
                        enable: true,
                        text: 'Subtitle for simple line chart. Lorem ipsum dolor sit amet, at eam blandit sadipscing, vim adhuc sanctus disputando ex, cu usu affert alienum urbanitas.',
                        css: {
                            'text-align': 'center',
                            'margin': '10px 13px 0px 7px'
                        }
                    },
                    caption: {
                        enable: true,
                        html: '<b>Figure 1.</b> Lorem ipsum dolor sit amet, at eam blandit sadipscing, <span style="text-decoration: underline;">vim adhuc sanctus disputando ex</span>, cu usu affert alienum urbanitas. <i>Cum in purto erat, mea ne nominavi persecuti reformidans.</i> Docendi blandit abhorreant ea has, minim tantas alterum pro eu. <span style="color: darkred;">Exerci graeci ad vix, elit tacimates ea duo</span>. Id mel eruditi fuisset. Stet vidit patrioque in pro, eum ex veri verterem abhorreant, id unum oportere intellegam nec<sup>[1, <a href="https://github.com/krispo/angular-nvd3" target="_blank">2</a>, 3]</sup>.',
                        css: {
                            'text-align': 'justify',
                            'margin': '10px 13px 0px 7px'
                        }
                    }
                };

                $scope.data = {};

                $scope.drillOrder = 0;
                $scope.m2a = util.mapToArray;
                $scope.options = {
                    isDrilling: true, // Faz a troca no frontend para habilitar ou desabilitar o clique do Drill
                    filterConfigOpen: false
                };
                $scope.idDashboard = $routeParams.id;

                $scope.filterOperators = AnalysisService.getFilterOperators();

                $scope.analysisExecuteRequest = {
                    analysis: null,
                    filters: [],
                    drill: null
                };

                var _prepareFiltersForRequest = function () {
//                    $scope.analysisExecuteRequest.filters = [];
//
//                    angular.forEach($scope.model.analysisViewerColumns, function (column) {
//                        if (column.columnType === "FILTER" && column.active) {
//                            $scope.analysisExecuteRequest.filters.push({
//                                operator: column.type, // o tipo do filtro
//                                columnName: column.analysisColumn.name,
//                                value: column.value
//                            });
//                        }
//                    });
                };
                
                function _closeFilterForms() {
                    if($scope.analysisExecuteRequest.filters) {
                        $scope.analysisExecuteRequest.filters.forEach(function(filter){
                            filter.isEditing=false;
                        });
                    }
                }
                
                $scope.addFilter = function(){
                    _closeFilterForms();
                    
                    $scope.analysisExecuteRequest.filters.push({
                        isEditing:true
                    });
                };

                $scope.possibleValues = function (filter) {
                    if ($scope.analysisExecuteRequest.analysis) { // pra ele não rodar antes da informação estar completa
                        _prepareFiltersForRequest();

                        AnalysisService.possibleValuesFor($scope.analysisExecuteRequest, filter).then(function (response) {
                            filter.possibleValues = response.data;
                        });
                    }
                };

                function updateChartFields(columnDrill) {
                    if (columnDrill) {
                        if ($scope.model.configuration.type === 'pie') {
                            $scope.model.configuration.titleField = columnDrill;
                        } else {
                            $scope.model.configuration.categoryField = columnDrill;
                        }
                    }
                }

                $scope.getAnalysisResult = function (itemClicked) {
                    _closeFilterForms();
                    _prepareDrillForRequest(itemClicked);
                    _prepareFiltersForRequest();

                    AnalysisService.execute($scope.analysisExecuteRequest).then(function (response) {
                        if ($scope.model.configuration.type === 'table') {
                            $scope.model.configuration.data = response.data;
                            $scope.model.columns = $scope.model.analysisViewerColumns;
                        } else {
                            var columnDrill = $scope.drillLevels[$scope.drillOrder];
                            if (columnDrill)
                                updateChartFields(columnDrill.label);

                            var typeViewer = identifyViewerType($scope.model, response.data);

                            if ($scope.model.configuration.type === 'pie' &&
                                    typeViewer === 2 && drillMaxLevel < 1) {
                                montaPieType2($scope.model, response.data);
                            } else if ($scope.model.configuration.type === 'serial' &&
                                    typeViewer === 2 && drillMaxLevel < 1) {
                                montaSerialType2($scope.model, response.data);
                            } else {
                                $scope.model.configuration.dataProvider = response.data;
                                $scope.model.configuration.export = {enabled: true};
                            }

                        }
                    });
                };

                if ($scope.model.id !== undefined) {
                    ViewerService.getAnalysisViewer($scope.model.id).then(function (response) {
                        angular.extend($scope.model, response.data);
                        $scope.analysisExecuteRequest.analysis = $scope.model.analysis;


                        $scope.model.analysisViewerColumns.filter(function (column) {
                            return column.columnType === "FILTER";
                        }).forEach(function (filter) {
                            filter.type = 'CONTAINS';
                            filter.value = {
                                value: null,
                                in: [],
                                between: {
                                    start: null,
                                    end: null
                                }
                            };
                        });

                        $scope.getAnalysisResult();
                    });
                }

                var identifyViewerType = function (viewer, result) {
                    var descriptionCount = 0;
                    var metricCount = 0;
                    viewer.analysisViewerColumns.forEach(function (analysisViewerColumn) {
                        if (analysisViewerColumn.columnType === 'METRIC') {
                            metricCount++;
                        }
                    });

                    if (metricCount > 1 && result.length === 1) {
                        return 2;
                    }

                    return 1;
                };

                var montaPieType2 = function (viewer, result) {
                    viewer.configuration.dataProvider = [];
                    var description = viewer.configuration.titleField;
                    var value = "value";
                    viewer.analysisViewerColumns.forEach(function (analysisViewerColumn) {
                        if (analysisViewerColumn.columnType === 'METRIC') {
                            for (var r in result) {
                                var obj = {};
                                var labelMetric = analysisViewerColumn.analysisColumn.label;
                                var valueMetric;
                                var object = result[r];
                                for (var t in object) {
                                    if (t === labelMetric) {
                                        valueMetric = object[t];
                                    }
                                }

                                if (valueMetric !== undefined) {
                                    obj[description] = labelMetric;
                                    obj.value = valueMetric;
                                }
                                viewer.configuration.dataProvider.push(obj);
                            }
                        }
                    });
                };

                var montaSerialType2 = function (viewer, result) {
                    viewer.configuration.dataProvider = [];
                    var description = viewer.configuration.categoryField;
                    var value = "value";

                    viewer.analysisViewerColumns.forEach(function (analysisViewerColumn) {
                        if (analysisViewerColumn.columnType === 'METRIC') {
                            for (var r in result) {
                                var obj = {};
                                var labelMetric = analysisViewerColumn.analysisColumn.label;
                                var valueMetric;
                                var object = result[r];
                                for (var t in object) {
                                    if (t === labelMetric) {
                                        valueMetric = object[t];
                                    }
                                }

                                if (valueMetric !== undefined) {
                                    obj[description] = labelMetric;
                                    obj.value = valueMetric;
                                }
                                viewer.configuration.dataProvider.push(obj);
                            }
                        }
                    });
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

                $scope.removeIndex = function (index) {
                    $scope.model.columns.splice(index, 1);
                };

                $scope.columnExample = '';
                $scope.columnsTable = [];
                $scope.$watchCollection('model.columns', function (newValue, oldValue) {
                    if ($scope.model.configuration !== undefined) {
                        if ($scope.model.configuration.type === 'table') {
                            $scope.columnsTable = {};
                            for (var key in newValue) {
                                $scope.columnExample = true;
                                if (newValue[key].columnType === 'COLUMN')
                                    $scope.columnsTable[key] = {value: newValue[key].analysisColumn.label};
                            }
                            if (Object.keys($scope.columnsTable).length === 0) {
                                $scope.columnExample = '';
                            }
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
                $scope.drillUp = function () {
                    $scope.drillOrder--;
                    $scope.drillLevels[$scope.drillOrder].filterDrillValue = undefined;

                    $scope.getAnalysisResult();
                };

                $scope.drillUpFromBreadCrumb = function (drillLevel) {
                    if($scope.drillOrder === drillLevel){
                        return; //mesmo level
                    } else if(($scope.drillOrder - 1) === drillLevel) {
                        $scope.drillUp(); //level anterior
                    }else{
                       for(var i = $scope.drillOrder ; i >= drillLevel; i--){
                           $scope.drillLevels[i].filterDrillValue = undefined;
                           console.log(i);
                       }
                       $scope.drillOrder = drillLevel;
                       $scope.getAnalysisResult();
                    }
                };

                $scope.exportCsv = function () {
                    ExportFile.export(
                        ExportFile.TYPE.CSV,
                        $scope.model.configuration.dataProvider,
                        $scope.model.name
                    );
                };

                $scope.exampleTable = ViewerService.getExampleTable();

                $scope.notEmpty = function () {
                    if (!$scope.drillLevels.length) {
                        return [];
                    }
                    return $scope.drillLevels.filter(function (item) {
                        return item.filterDrillValue ? true : false;
                    });
                };

                $scope.drillLevels = [];
                $scope.setChart = function (chart) {
                    $scope.chart = chart;
                    prepareOrderDrill($scope.model.analysis.analysisColumns);
                    if ($scope.chart.type === 'pie') {
                        $scope.chart.addListener("clickSlice", function (event) {
                            if ($scope.drillOrder < drillMaxLevel && $scope.options.isDrilling) {
                                $scope.getAnalysisResult(event.dataItem.title);
                            }
                        });
                    } else {
                        $scope.chart.addListener("clickGraphItem", function (event) {
                            if ($scope.drillOrder < drillMaxLevel && $scope.options.isDrilling) {
                                $scope.getAnalysisResult(event.item.category);
                            }
                        });
                    }
                };

                //Função para que o array de analysisColumnDrill seja populado corretamente
                var drillMaxLevel = 0;
                function prepareOrderDrill(analysisColumns) {
                    if ($scope.drillLevels.length === 0) {
                        $scope.drillLevels = [];
                        var array = {};
                        for (var a in analysisColumns) {
                            if (analysisColumns[a].orderDrill !== undefined &&
                                    analysisColumns[a].orderDrill !== '') {

                                var drillLevel = {name: analysisColumns[a].name,
                                    label: analysisColumns[a].label};
                                array[analysisColumns[a].orderDrill] = drillLevel;
                            }
                        }
                        for (var key in array) {
                            $scope.drillLevels.push(array[key]);
                        }
                        drillMaxLevel = $scope.drillLevels.length - 1;
                    }
                }

                function _prepareDrillForRequest(itemClicked) {
                    if ($scope.analysisExecuteRequest.analysis.hasDrill) {
                        prepareOrderDrill($scope.model.analysis.analysisColumns);

                        $scope.analysisExecuteRequest.drill = {};
                        $scope.analysisExecuteRequest.drill.columnsToSum = [];

                        if (itemClicked) {
                            $scope.drillLevels[$scope.drillOrder].filterDrillValue = itemClicked;
                            definePreviousColumns($scope.drillOrder);
                            $scope.drillOrder++;
                            //back button
                        } else {
                            definePreviousColumns($scope.drillOrder);
                        }

                        $scope.analysisExecuteRequest.drill
                                .columnToDrill = $scope.drillLevels[$scope.drillOrder].name;

                        populateColumnsToSum();
                    }
                }

                function definePreviousColumns(drillOrder) {
                    $scope.analysisExecuteRequest.drill.listPreviousColumns = [];
                    var copyDrillOrder = angular.copy(drillOrder);

                    while (copyDrillOrder >= 0) {
                        var drillColumnValue = {};
                        drillColumnValue.drillColumn = $scope.drillLevels[copyDrillOrder].name;
                        drillColumnValue.drillFilterValue = $scope.drillLevels[copyDrillOrder].filterDrillValue;

                        if (drillColumnValue.drillColumn !== undefined && drillColumnValue.drillFilterValue !== undefined) {
                            $scope.analysisExecuteRequest.drill.listPreviousColumns.push(drillColumnValue);
                        }
                        copyDrillOrder--;
                    }
                }

                function populateColumnsToSum() {
                    angular.forEach($scope.model.analysisViewerColumns, function (column) {
                        if (column.columnType === "METRIC") {
                            $scope.analysisExecuteRequest
                                    .drill.columnsToSum.push(column.analysisColumn.name);
                        }
                    });
                }
            }
        };
    });
});