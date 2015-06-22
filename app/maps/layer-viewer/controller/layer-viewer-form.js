define([
    'connecta.maps',
    'bower_components/connectaGeoJS/index/utils/colorComponent',
    'maps/layer/service/layer-service',
    'maps/layer-viewer/service/layer-viewer-service',
    'portal/layout/service/notify'
], function (maps, colorComponent) {
    return maps.lazy.controller('LayerViewerFormController', function ($scope, LayerService, notify, LayerViewerService, $location, $routeParams, $translate) {

        $scope.types = LayerViewerService.getTypes();

        $scope.isEditing = false;

        $scope.layers = [];

        $scope.layerColumns = [];

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
//                        $scope.layerViewer.ds_param_names = "styleName";
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
//                    $scope.analisys = ["option1", "option2", "option3", "option4", "option5"];
//TESTE DO OBJETO DE ANÁLISES
                    $scope.analisys = {
                        "config": [{
                                "columnLayer": "no_regiao",
                                "columnBoundName": "regiao",
                                "valueColumn": "NORTE",
                                "valueMetric": "20",
                                "objValues": "NORTE",
                                "color": "#ffff00",
                                "legend": "20 - 36",
                                "title": "asfsafa"
                            }, {
                                "columnLayer": "no_regiao",
                                "columnBoundName": "regiao",
                                "valueColumn": "SUL",
                                "valueMetric": "40",
                                "objValues": "SUL",
                                "color": "#ffbf00",
                                "legend": "36 - 52",
                                "title": "asfsafa"
                            }, {
                                "columnLayer": "no_regiao",
                                "columnBoundName": "regiao",
                                "valueColumn": "CENTRO-OESTE",
                                "valueMetric": "60",
                                "objValues": "CENTRO-OESTE",
                                "color": "#ff8000",
                                "legend": "52 - 68",
                                "title": "asfsafa"
                            }, {
                                "columnLayer": "no_regiao",
                                "columnBoundName": "regiao",
                                "valueColumn": "SUDESTE",
                                "valueMetric": "80",
                                "objValues": "SUDESTE",
                                "color": "#ff4000",
                                "legend": "68 - 84",
                                "title": "asfsafa"
                            }, {
                                "columnLayer": "no_regiao",
                                "columnBoundName": "regiao",
                                "valueColumn": "NORDESTE",
                                "valueMetric": "100",
                                "objValues": "NORDESTE",
                                "color": "#ff0000",
                                "legend": "84 - 100",
                                "title": "asfsafa"
                            }]};
                    console.info("$scope.analisys", $scope.analisys);
                    break;
            }


            var layerByType = (typeLayer === 1 || typeLayer === "1") ? LayerService.list() : LayerService.getByType(1);

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
                $scope.layerColumns = $scope.layerViewer.layerEntity.txt_columns.split("#");
            }
        };

        $scope.generateIdAnalisy = function () {
            $scope.id_analisys = ["id_analisy1", "id_analisy2", "id_analisy3", "id_analisy4"];
        };

        $scope.generateColorDegradee = function () {

            var rangeColor = new colorComponent().calculateDegradee($scope.layerViewer.initialColor, $scope.layerViewer.finalColor, $scope.layerViewer.qtd_classes, 1);

            if ($scope.layerViewer.qtd_classes > 1) {
                $scope.layerViewer.initialColorClass1 = rangeColor[1];
            }
            if ($scope.layerViewer.qtd_classes > 2) {
                $scope.layerViewer.initialColorClass2 = rangeColor[2];
            }
            if ($scope.layerViewer.qtd_classes > 3) {
                $scope.layerViewer.initialColorClass3 = rangeColor[3];
            }
            if ($scope.layerViewer.qtd_classes > 4) {
                $scope.layerViewer.initialColorClass4 = rangeColor[4];
            }
        };

        $scope.submit = function () {

            $scope.layerViewer.layerEntity = {"id": $scope.layerViewer.layerEntity.id};

            switch (parseInt($scope.layerViewer.layerViewerTypeEntity.id)) {
                case 1:
                    $scope.layerViewer.ds_param_names = "styleName";
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
            }

            LayerViewerService.save($scope.layerViewer).then(function () {
                $translate('LAYERVIEWER.ADDED_SUCCESS').then(function (text) {
                    notify.success(text);
                    $location.path('maps/layer-viewer');
                });
            }, function (response) {
                notify.error(response);
            });
        };
    });
});

