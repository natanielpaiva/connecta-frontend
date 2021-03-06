define([
    'connecta.maps',
    'bower_components/connectaGeoJS/index/utils/colorComponent',
    'maps/layer/service/layer-service',
    'maps/layer-viewer/service/layer-viewer-service',
    'portal/layout/service/notify',
    'maps/presenter-source/service/presenter-source-service',
    'portal/layout/service/modalTranslate'
], function (maps, colorComponent) {
    return maps.lazy.controller('LayerViewerFormController', function ($scope, LayerService, notify, LayerViewerService, PresenterSourceService, $location, $routeParams, $translate,$modalTranslate) {

        $scope.types = LayerViewerService.getTypes();
        $scope.isEditing = false;
        $scope.presenterAnalysis = null;
        $scope.layers = [];
        $scope.layerColumns = [];
        
          //translate buttons text
        $scope.viewerTypes = {
            default: "DEFAULT",
            heatmap: "HEATMAP",
            cluster: "CLUSTER",
            analysis: "ANALYSIS"
        };

        $modalTranslate($scope.viewerTypes, 'default', 'LAYERVIEWER.DEFAULT');
        $modalTranslate($scope.viewerTypes, 'heatmap', 'LAYERVIEWER.HEATMAP');
        $modalTranslate($scope.viewerTypes, 'cluster', 'LAYERVIEWER.CLUSTER');
        $modalTranslate($scope.viewerTypes, 'analysis', 'LAYERVIEWER.ANALYSIS');
       
        

        $scope.getPresenterSource = function () {
            PresenterSourceService.list().then(function (response) {
                PresenterSourceService.get(response.data[0].id).then(function (response) {
                    $scope.presenterSource = response.data;
                    PresenterSourceService.getUserDomain($scope.presenterSource, $scope);
                }, function (response) {
                    console.info("error", response);
                });
            });
        };


        $scope.getAnalysisData = function (idAnalysis) {
            $scope.analyisisID = idAnalysis;
            $scope.analysisColumns = "";
            $scope.analysisData = "";
            $scope.analysisColumnsMetric = "";
            PresenterSourceService.getAnalysisData($scope, idAnalysis);
        };
        
        
        var generateColorHexadecimal = function () {
            var letters = '0123456789ABCDEF'.split('');
            var color = '#';
            for (var i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        };
        $scope.layerViewer = {
            initialColor: "#FF0000",
            finalColor: "#0000FF",
            ds_param_names: " ",
            ds_param_values: " ",
            raioInitial: 5,
            raioFinal: 5,
            ini_initialColor: generateColorHexadecimal(),
            fim_initialColor: generateColorHexadecimal(),
            ini_finalColor: "#FFFFFF",
            fim_finalColor: "#FFFFFF",
            opacityInitial: 100,
            opacityFinal: 100,
            parameters: [{
                    int_raioInitial: 5,
                    int_initialColor: generateColorHexadecimal(),
                    int_finalColor: "#FFFFFF",
                    int_opacity: 100,
                    int_de: 5,
                    int_para: 6
                }]
        };
        var obj = {
            int_raioInitial: 5,
            int_initialColor: "",
            int_finalColor: "",
            int_opacity: 100,
            int_de: 1,
            int_para: 2
        };
        $scope.paramInterLayerViewer = function () {
            obj.int_initialColor = generateColorHexadecimal();
            obj.int_finalColor = "#FFFFFF";
            return obj;
        };
        var arrayWatch = [];
        //escuta o obj de parameters para saber quando se adicionou uma novo combo de intervalo
        $scope.$watch('layerViewer.parameters.length', function () {

            for (var lol in arrayWatch) {
                arrayWatch[lol]();
            }
            arrayWatch = [];
            //quando existir os campos, setar a propriedade de valor minimo
            var intervalMin = setInterval(function () {
                if (angular.element(".intervalMin")[0]) {
                    if ((typeof angular.element(".intervalMin")[0]) === "undefined") {
                        angular.element(angular.element(".intervalMin")[0]).val(5);
                        angular.element(angular.element(".intervalMin")[1]).val(6);
                    }
                    angular.element(angular.element(".intervalMin")[0]).attr("min", "5");
                    angular.element(angular.element(".intervalMin")[1]).attr("min", "6");
                    angular.element(angular.element(".intervalMin")[2]).attr("min", "7");
                    angular.element(angular.element(".intervalMin")[3]).attr("min", "8");
                    clearInterval(intervalMinimo);
                }
            }, 50);
            //para quando tiver um intervalo
            arrayWatch.push($scope.$watch('layerViewer.parameters[0].int_de', function (val) {
                if (val >= $scope.layerViewer.parameters[0].int_para) {
                    $scope.layerViewer.parameters[0].int_para = val + 1;
                }
            }));
            arrayWatch.push($scope.$watch('layerViewer.parameters[0].int_para', function (val) {
                if (val <= $scope.layerViewer.parameters[0].int_de) {
                    $scope.layerViewer.parameters[0].int_de = val - 1;
                }
            }));
            //para quando tiver dois intervalos
            if ($scope.layerViewer.parameters.length > 1) {
                console.log("minimo 4", angular.element(".intervalMin"));
                //quando existir os campos, setar a propriedade de valor minimo
                var intervalMinimo = setInterval(function () {
                    if (angular.element(".intervalMin")[2]) {
                        angular.element(angular.element(".intervalMin")[2]).attr("min", "7");
                        angular.element(angular.element(".intervalMin")[3]).attr("min", "8");
                        clearInterval(intervalMinimo);
                    }
                }, 50);
                arrayWatch.push($scope.$watch('layerViewer.parameters[0].int_para', function (val) {
                    if ($scope.layerViewer.parameters[1]) {
                        $scope.layerViewer.parameters[1].int_de = val + 1;
                    }
                }));
                arrayWatch.push($scope.$watch('layerViewer.parameters[1].int_de', function (val) {
                    if ($scope.layerViewer.parameters[1]) {
                        $scope.layerViewer.parameters[0].int_para = val - 1;
                        if (val >= $scope.layerViewer.parameters[1].int_para) {
                            $scope.layerViewer.parameters[1].int_para = val + 1;
                        }
                    }
                }));
                arrayWatch.push($scope.$watch('layerViewer.parameters[1].int_para', function (val) {
                    if ($scope.layerViewer.parameters[1]) {
                        if (val <= $scope.layerViewer.parameters[1].int_de) {
                            $scope.layerViewer.parameters[1].int_de = val - 1;
                        }
                    }
                }));
            }

            //para quando tiver tres intervalos
            if ($scope.layerViewer.parameters.length > 2) {
                console.log("AINDA EXISTE O 2");
                //quando existir os campos, setar os propriedade de valor minimo
                var intervalMin2 = setInterval(function () {
                    if (angular.element(".intervalMin")[4]) {
                        angular.element(angular.element(".intervalMin")[4]).attr("min", "9");
                        angular.element(angular.element(".intervalMin")[5]).attr("min", "10");
                        clearInterval(intervalMin2);
                    }
                }, 50);
                arrayWatch.push($scope.$watch('layerViewer.parameters[1].int_para', function (val) {
                    if ($scope.layerViewer.parameters[2]) {
                        $scope.layerViewer.parameters[2].int_de = val + 1;
                    }
                }));
                arrayWatch.push($scope.$watch('layerViewer.parameters[2].int_de', function (val) {
                    if ($scope.layerViewer.parameters[2]) {
                        $scope.layerViewer.parameters[1].int_para = val - 1;
                        if (val >= $scope.layerViewer.parameters[2].int_para) {
                            $scope.layerViewer.parameters[2].int_para = val + 1;
                        }
                    }
                }));
                arrayWatch.push($scope.$watch('layerViewer.parameters[2].int_para', function (val) {
                    if ($scope.layerViewer.parameters[2]) {
                        if (val <= $scope.layerViewer.parameters[2].int_de) {
                            if (val <= $scope.layerViewer.parameters[2].int_de) {
                                $scope.layerViewer.parameters[2].int_de = val - 1;
                            }
                        }
                    }
                }));
            }
        });
        if ($routeParams.id) {
            $scope.isEditing = true;
            LayerViewerService.getById($routeParams.id).then(function (response) {

                $scope.layerViewer = response.data;
                $scope.layerViewer.parameters = [{}];
                $scope.getLayerByType($scope.layerViewer.layerViewerTypeEntity.id);
                var temp = setInterval(function () {
                    angular.element("#layerEntity").val(angular.element("#layerEntity").find("option[label='" + $scope.layerViewer.layerEntity.ds_layer + "']").val());
                    if ($scope.formulario.layer.$viewValue !== '') {
                        clearInterval(temp);
                    }
                }, 500);
                var ds_param_values = "";
                switch ($scope.layerViewer.layerViewerTypeEntity.id) {
                    case 1:
                        $scope.layerViewer.ds_param_names = "styleName";
                        break;
                    case 2:
                        ds_param_values = $scope.layerViewer.ds_param_values.split("~");
                        $scope.layerViewer.initialColor = ds_param_values[0];
                        $scope.layerViewer.finalColor = ds_param_values[1];
                        break;
                    case 3:

                        ds_param_values = $scope.layerViewer.ds_param_values.replace(/@/gi, "");
                        ds_param_values = $scope.layerViewer.ds_param_values.split("~");
                        var countParamValues = 0;
                        $scope.layerViewer.raioInitial = parseInt(ds_param_values[countParamValues]);
                        $scope.layerViewer.ini_initialColor = ds_param_values[++countParamValues];
                        $scope.layerViewer.ini_finalColor = ds_param_values[++countParamValues];
                        $scope.layerViewer.opacityInitial = parseInt(ds_param_values[++countParamValues]);
                        for (var item = 0; item < ds_param_values[ds_param_values.length - 1]; item++) {
                            $scope.layerViewer.parameters[item].int_raioInitial = parseInt(ds_param_values[++countParamValues]);
                            $scope.layerViewer.parameters[item].int_initialColor = ds_param_values[++countParamValues];
                            $scope.layerViewer.parameters[item].int_finalColor = ds_param_values[++countParamValues];
                            $scope.layerViewer.parameters[item].int_opacity = parseInt(ds_param_values[++countParamValues]);
                            $scope.layerViewer.parameters[item].int_de = parseInt(ds_param_values[++countParamValues]);
                            $scope.layerViewer.parameters[item].int_para = parseInt(ds_param_values[++countParamValues]);
                            if (item + 1 < ds_param_values[ds_param_values.length - 1]) {
                                $scope.layerViewer.parameters.push({});
                            }

                        }

                        $scope.layerViewer.raioFinal = parseInt(ds_param_values[++countParamValues]);
                        $scope.layerViewer.fim_initialColor = ds_param_values[++countParamValues];
                        $scope.layerViewer.fim_finalColor = ds_param_values[++countParamValues];
                        $scope.layerViewer.opacityFinal = parseInt(ds_param_values[++countParamValues]);
                        break;
                }


            });
        } else {
            $scope.layerViewer.type = Object.keys($scope.types)[0];
        }

        $scope.getLayerByType = function (typeLayer) {
            $scope.layerColumns = [];
            if (typeLayer === '') {
                $scope.layers = [];
                return false;
            }

//setando evento para o campo de input file
            switch (typeLayer) {
                case '1':
                    var type1 = setInterval(function () {
                        if (angular.element("#file-original")) {
                            angular.element("#file-original").change(function () {
                                angular.element("#file-falso").val(angular.element("#file-original").val());
                            });
                            clearInterval(type1);
                        }
                    }, 500);
                    break;
                case '4':
                    //Carrega dados do presenter
                    $scope.getPresenterSource();
                    break;
            }


            var layerByType = (typeLayer === 1 || typeLayer === "1" || typeLayer === 4 || typeLayer === "4") ? LayerService.list() : LayerService.getByType(1);
            layerByType.then(function (result) {
                $scope.layers = result.data;
            }, function () {
                console.info("ERROR");
            });
        };
        $scope.validateColorCluster = function (element) {
//            verificação de campos com cores iguais            
//            var itens = angular.element(".validate-cluster");
//            var flag = 0;
//            for (var item in itens) {
//                if (itens[item].value === element) {
//                    ++flag;
//                    if (flag > 1) {
//                        console.log("não pode conter campos iguais");
//                        return false;
//                    }
//                } else {
//                    console.log("tudo certo");
//                }
//            }

        };
        $scope.generateComboColumns = function () {
            $scope.layerColumns = [];
            $scope.layerViewer.id_layer = "";
            if ($scope.layerViewer.layerViewerTypeEntity.id === "4") {
                console.log("4444444", $scope.layerViewer.layerEntity);
                $scope.layerColumns = $scope.layerViewer.layerEntity.txt_columns.split("#");
            }
        };
        
        $scope.generateAnalyisViewerConfig = function () {
            //console.info("ANALYSIS INFO", $scope.analysisColumns, $scope.analysisData, $scope.analysisColumnsMetric);
            var analysisColumnId = angular.element("#analysisColumns>option:selected").val();
            var analysisMetricId = angular.element("#analysisColumnsMetric>option:selected").val();
            //console.info("METRIC ID", analysisMetricId);
            $scope.dataAnalysisValues = [];
            $scope.dataAnalysisObjValues = [];
            for (var data in $scope.analysisData) {
                //console.info("ANALYSIS DATA OBJ", $scope.analysisData[data][analysisColumnId] + "#" + $scope.analysisData[data][analysisMetricId]);
                $scope.dataAnalysisValues.push($scope.analysisData[data][analysisMetricId]);
                $scope.dataAnalysisObjValues.push($scope.analysisData[data][analysisColumnId] + "#" + $scope.analysisData[data][analysisMetricId]);
            }

            //Ordena array de valores
            $scope.dataAnalysisValues.sort(function (a, b) {
                return (a - b);
            });

            var init = parseInt($scope.dataAnalysisValues[0]);
            var end = $scope.dataAnalysisValues[$scope.dataAnalysisValues.length - 1];
            var size = angular.element("#qtdClasses>option:selected").val();
            var rate = (end - init) / size;
            var rangeColor = new colorComponent().calculateDegradee($scope.layerViewer.initialColor, $scope.layerViewer.finalColor, $scope.layerViewer.qtd_classes, 1);
            //Limpa o form de métricas
            var rangeInit, rangeEnd;
            $scope.analysisViewerRanges = [];
            for (var i = 1; i < size; i++) {
                rangeInit = Math.round(init + (rate * i));
                rangeEnd = Math.round(init + (rate * (i + 1)));
                var columnName = "numberOF" + i;
                var columnName2 = "numberTO" + i;
                var columnLegend = "legend" + i;
                $scope.layerViewer[columnName] = rangeInit;
                $scope.layerViewer[columnName2] = rangeEnd;
                $scope.layerViewer[columnLegend] = rangeInit + '-' + rangeEnd;
                var legend = $scope.layerViewer[columnLegend];
                var columnNameColor = "initialColorClass" + i;
                $scope.layerViewer[columnNameColor] = rangeColor[i];
                //Ranges
                $scope.analysisViewerRanges.push({'rangeInit': rangeInit, 'rangeEnd': rangeEnd, 'legend': legend, 'color': rangeColor[i]});
            }
        };


        //Retorna range em que a métrica está enquadrada
        $scope.returnRange = function (metric) {
            var rangOBJ = $.grep($scope.analysisViewerRanges, function (element, key) {
                return element.rangeInit < metric && element.rangeEnd > metric;
            });

            return rangOBJ;
        };

        //Retorna itens duplicados
        $scope.returnDuplicates = function (legend) {
            var items = $.grep($scope.config, function (elem, key) {
                return elem.legend == legend;
            });
            return items;
        };


        //Ordena array por propriedade
        $scope.sortArrayByProp = function (prop) {

            return function (a, b) {
                if (a[prop] > b[prop]) {
                    return 1;
                } else if (a[prop] < b[prop]) {
                    return -1;
                }
                return 0;
            };

        };

        //Agrupa por Ranges em comum
        $scope.groupRanges = function () {
            //Agrupa elementos
            for (var elem in $scope.config) {
                var objArray = $scope.config[elem];
                for (var elem2 in $scope.config) {
                    var objArray2 = $scope.config[elem2];
                    if (objArray.color === objArray2.color && objArray.valueColumn !== objArray2.valueColumn) {
                        objArray2.objValues += '#' + objArray.valueColumn;
                        delete $scope.config[objArray2];
                    }
                }
            }

            //Remove duplicados
            $scope.stylesConfigArray = [];
            for (var obj in $scope.config) {
                var legend = $scope.config[obj].legend;
                var items = $scope.returnDuplicates(legend);

                if (items.length > 1) {
                    if ($scope.stylesConfigArray.indexOf(items[0]) === -1) {

                        $scope.stylesConfigArray.push(items[0]);
                    }
                } else {
                    $scope.stylesConfigArray.push(items[0]);
                }
            }
        };

        $scope.submit = function () {

            $scope.layerViewer.layerEntity = {"id": $scope.layerViewer.layerEntity.id};
            switch (parseInt($scope.layerViewer.layerViewerTypeEntity.id)) {
                case 1:
                    $scope.layerViewer.ds_param_names = "styleName";
                    if (typeof angular.element('#file-original').get(0).files[0] != 'undefined') {
                        var formData = new FormData();
                        var styleName = $scope.layerViewer.nm_viewer.replace(/ /gi, "_");
                        $scope.layerViewer.ds_param_values = styleName;
                        formData.append('styleName', styleName);
                        formData.append('layerID', $scope.layerViewer.layerEntity.id);
                        formData.append("file", angular.element('#file-original').get(0).files[0]);
                        LayerViewerService.createStyle(formData);
                    }

                    break;
                case 2:
                    $scope.layerViewer.ds_param_names = "initialColor~finalColor";
                    $scope.layerViewer.ds_param_values = $scope.layerViewer.initialColor + "~" + $scope.layerViewer.finalColor;
                    break;
                case 3:
                    var intervalsCluster = "";
                    var countIntervals = 0;
                    for (var item in $scope.layerViewer.parameters) {
                        countIntervals += 1;
                        lol = $scope.layerViewer.parameters[item];
                        intervalsCluster +=
                                $scope.layerViewer.parameters[item].int_raioInitial + "~" +
                                $scope.layerViewer.parameters[item].int_initialColor + "~" +
                                $scope.layerViewer.parameters[item].int_finalColor + "~" +
                                $scope.layerViewer.parameters[item].int_opacity + "~" +
                                $scope.layerViewer.parameters[item].int_de + "~" +
                                $scope.layerViewer.parameters[item].int_para + "@~";
                    }

//                    $scope.layerViewer.ds_param_names = "initialColor~ini_initialColor~ini_finalColor~opacityFinal~raioFinal~fim_initialColor~fim_initialColor~opacityFinal";
                    $scope.layerViewer.ds_param_names = "param_names";
                    $scope.layerViewer.ds_param_values =
                            $scope.layerViewer.raioInitial + "~" +
                            $scope.layerViewer.ini_initialColor + "~" +
                            $scope.layerViewer.ini_finalColor + "~" +
                            $scope.layerViewer.opacityFinal + "@~" +
                            intervalsCluster +
                            $scope.layerViewer.raioFinal + "~" +
                            $scope.layerViewer.fim_initialColor + "~" +
                            $scope.layerViewer.fim_finalColor + "~" +
                            $scope.layerViewer.opacityFinal + "~" +
                            countIntervals;
                    break;
                case 4:
                    $scope.config = [];
                    var temp = null;
                    for (var objValue in $scope.dataAnalysisObjValues) {
                        var obj = null;
                        obj = {"columnLayer": null,
                            "columnBoundName": null,
                            "valueColumn": null,
                            "valueMetric": null,
                            "objValues": null,
                            "color": null,
                            "legend": null,
                            //"title": "goiaba_nadal"
                            "title": $scope.layerViewer.nm_viewer
                        };
                        temp = $scope.dataAnalysisObjValues[objValue].split('#');
                        var columnLayer = angular.element('#id_layer>option:selected').text();
                        var columnAnalysis = angular.element('#analysisColumns>option:selected').text();
                        obj.columnLayer = columnLayer;
                        obj.columnBoundName = columnAnalysis;
                        obj.valueColumn = temp[0];
                        obj.objValues = temp[0];

                        var rangOBJ = $scope.returnRange(temp[1]);

                        if (rangOBJ.length > 0) {
                            obj.valueMetric = temp[1];
                            obj.color = rangOBJ[0].color;
                            obj.legend = rangOBJ[0].legend;
                        } else {

                            if (temp[1] < $scope.analysisViewerRanges[0].rangeInit) {
                                obj.valueMetric = temp[1];
                                obj.color = $scope.layerViewer.initialColor;
                                obj.legend = "0 - " + $scope.analysisViewerRanges[0].rangeInit;
                            } else {
                                obj.valueMetric = temp[1];
                                obj.color = $scope.layerViewer.finalColor;
                                obj.legend = ">" + parseInt(temp[1] - 1);
                            }
                        }
                        $scope.config.push(obj);
                    }

                    //agrupa valores com range em comum                    
                    $scope.groupRanges();

                    $scope.stylesConfigArray.sort($scope.sortArrayByProp('valueMetric'));

                    console.info("CONFIG STYLE", $scope.stylesConfigArray);
                    LayerViewerService.createAnalysisStyle($scope.stylesConfigArray, $scope.layerViewer.layerEntity.id, $scope);


                    if (parseInt($scope.layerViewer.layerViewerTypeEntity.id) === 4) {
                        var interval = setInterval(function () {
                            if (typeof $scope.styleName != 'undefined') {

                                $scope.layerViewer.ds_param_names = "styleName#analysisID";
                                $scope.layerViewer.ds_param_values = $scope.styleName + "#" + $scope.analyisisID;

                                LayerViewerService.save($scope.layerViewer).then(function () {
                                    $translate('LAYERVIEWER.ADDED_SUCCESS').then(function (text) {
                                        notify.success(text);
                                        $location.path('maps/layer-viewer');
                                    });
                                }, function (response) {
                                    notify.error(response);
                                });

                                clearInterval(interval);
                            }
                        });
                    } else {

                        LayerViewerService.save($scope.layerViewer).then(function () {
                            $translate('LAYERVIEWER.ADDED_SUCCESS').then(function (text) {
                                notify.success(text);
                                $location.path('maps/layer-viewer');
                            });
                        }, function (response) {
                            notify.error(response);
                        });
                    }

            }
        };
    });
});