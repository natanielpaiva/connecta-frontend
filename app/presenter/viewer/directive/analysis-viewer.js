/* global angular */
define([
    'connecta.portal',
    'portal/layout/service/util',
    'portal/layout/directive/click-out',
    'presenter/analysis/service/analysis-service',
    'presenter/viewer/service/viewer-service',
    'bower_components/amcharts/dist/amcharts/exporting/canvg',
    'bower_components/amcharts/dist/amcharts/exporting/rgbcolor'
], function (portal) {
    return portal.lazy.directive('analysisViewer', function () {
        return {
            templateUrl: 'app/presenter/viewer/directive/template/analysis-viewer.html',
            scope: {
                model: '=ngModel',
                edit: '=?edit'
            },
            controller: function ($scope, ViewerService, AnalysisService, util) {
                $scope.drillOrder = 0;
                $scope.m2a = util.mapToArray;
                $scope.options = {
                    isDrilling: false, // Faz a troca no frontend para habilitar ou desabilitar o clique do Drill
                    filterConfigOpen: false
                };

                $scope.filterOperators = AnalysisService.getFilterOperators();

                $scope.analysisExecuteRequest = {
                    analysis: null,
                    filters: [],
                    drill: null
                };

                var _prepareFiltersForRequest = function () {
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

                $scope.exportPng = function () {
                    element = angular.element('.amchart');
                    type = 'png';
                    isPdf = false;
                    filename = $scope.model.name;

                    wrapper = element[0];
                    svgs = wrapper.getElementsByTagName('svg');

                    options = {
                        ignoreAnimation: true,
                        ignoreMouse: true,
                        ignoreClear: true,
                        ignoreDimensions: true,
                        offsetX: 0,
                        offsetY: 0
                    };
                    canvas = document.createElement('canvas');
                    context = canvas.getContext('2d');
                    counter = {
                        height: 0,
                        width: 0
                    };

                    function removeImages(svg) {
                        startStr = '<image';
                        stopStr = '</image>';
                        stopStrAlt = '/>';
                        start = svg.indexOf(startStr);
                        match = '';

                        if (start !== -1) {
                            stop = svg.slice(start, start + 1000).indexOf(stopStr);
                            if (stop !== -1) {
                                svg = removeImages(svg.slice(0, start) + svg.slice(start + stop + stopStr.length, svg.length));
                            } else {
                                stop = svg.slice(start, start + 1000).indexOf(stopStrAlt);
                                if (stop !== -1) {
                                    svg = removeImages(svg.slice(0, start) + svg.slice(start + stop + stopStr.length, svg.length));
                                }
                            }
                        }
                        return svg;
                    }

                    canvas.height = wrapper.offsetHeight;
                    canvas.width = wrapper.offsetWidth;
                    context.fillStyle = '#ffffff';
                    context.fillRect(0, 0, canvas.width, canvas.height);

                    if (svgs.length > 0) {
                        // Add SVGs
                        for (var i = 0; i < svgs.length; i++) {
                            var container = svgs[i].parentNode;
                            var innerHTML = removeImages(container.innerHTML); // remove images from svg until its supported

                            options.offsetY = counter.height;
                            counter.height += container.offsetHeight;
                            counter.width = container.offsetWidth;
                            canvg(canvas, innerHTML, options);
                        }

                        var image = canvas.toDataURL('image/' + type);
                        $scope.outputData(image, filename, isPdf);
                        // Adiciona Legenda ao Container inicial da mesma
                    } else {
                        html2canvas([angular.element('.analysis-viewer')[0]], {
                            useCORS: true
                        }).then(function (canvas) {

                            var image = canvas.toDataURL("image/" + type);
                            image = image.replace('data:image/jpeg;base64,', '');
                            finalImageSrc = 'data:image/jpeg;base64,' + image;
                            $scope.outputData(finalImageSrc, filename, isPdf);
                        });
                    }

                };
                $scope.outputData = function (image, filename, isPdf) {
                    var obj_url;
                    if (isPdf) {

                        var imgData = image;
                        var doc = new jsPDF();
                        doc.addImage(imgData, 'JPEG', 0, 0);
                        // Saída como URI de Dados
                        obj_url = doc.output('dataurlstring');
                    } else {

                        window.URL = window.webkitURL || window.URL;
                        var image_data = atob(image.split(',')[1]);
                        // Converter os dados binários em um Blob
                        var arraybuffer = new ArrayBuffer(image_data.length);
                        var view = new Uint8Array(arraybuffer);
                        for (var i = 0; i < image_data.length; i++) {
                            view[i] = image_data.charCodeAt(i) & 0xff;
                        }

                        var oBuilder = new Blob([view], {type: 'application/octet-stream'});
                        obj_url = window.URL.createObjectURL(oBuilder);
                    }

                    var a = angular.element("<a/>");
                    angular.element("body").append(a);
                    a[0].href = obj_url;
                    a[0].download = filename + '.jpg';
                    a[0].click();
                    a.remove();
                };

                $scope.exportCsv = function () {
                    var array = $scope.model.configuration.dataProvider;
                    var csv = '';
                    for (var head in array[0]) {
                        csv += head + ';';
                    }
                    csv += '\r\n';

                    for (var i = 0; i < array.length; i++) {
                        var line = '';
                        for (var index in array[i]) {
                            if (line !== '')
                                line += ';';

                            line += array[i][index];
                        }
                        csv += line + '\r\n';
                    }

                    var uri = "data:text/csv;charset=ISO-8859-1," + escape(csv);
                    var name = $scope.model.name + ".csv";
                    var download = document.createElement("a");
                    download.href = uri;
                    download.download = name;
                    document.body.appendChild(download);
                    download.click();
                    document.body.removeChild(download);
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
