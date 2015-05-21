define([
    'connecta.maps',
    'maps/layer/service/layer-service',
    'maps/layer-viewer/service/layer-viewer-service'
], function (presenter) {
    return presenter.lazy.controller('LayerViewerFormController', function ($scope, LayerService, LayerViewerService, $location, $routeParams) {

        $scope.types = LayerViewerService.getTypes();

        $scope.isEditing = false;

        $scope.layers = [];

        $scope.generateColorHexadecimal = function () {
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
            ini_initialColor: $scope.generateColorHexadecimal(),
            fim_initialColor: $scope.generateColorHexadecimal(),
            ini_finalColor: $scope.generateColorHexadecimal(),
            fim_finalColor: $scope.generateColorHexadecimal(),
            opacityInitial: 100,
            opacityFinal: 100,
            parameters: [{
                    int_raioInitial: 5,
                    int_initialColor: $scope.generateColorHexadecimal(),
                    int_finalColor: $scope.generateColorHexadecimal(),
                    int_opacity: 100
                }]
        };

        if ($routeParams.id) {
            $scope.isEditing = true;
            LayerViewerService.getById($routeParams.id).then(function (response) {

                $scope.layerViewer = response.data;
                $scope.layerViewer.parameters = [{}];

                console.log("$scope.layerViewer", $scope.layerViewer);

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

            if (typeLayer === '') {
                $scope.layers = [];
                return false;
            }

            var layerByType = (typeLayer == 1) ? LayerService.list() : LayerService.getByType(1);

            layerByType.then(function (result) {
                $scope.layers = result.data;
            }, function () {
                console.info("ERROR");
            });

        };

        $scope.validateColorCluster = function (element) {

            var itens = angular.element(".validate-cluster");

            for (var item in itens) {
                if (itens[item].value == element) {
                    console.log("não pode conter campos iguais");
                    return false;
                } else {
                    console.log("tudo certo");
                }
            }
            
        };

        $scope.submit = function () {

            $scope.layerViewer.layerEntity = {"id": $scope.layerViewer.layerEntity.id};
            console.log("layerViewer.layerViewerTypeEntity.id", $scope.layerViewer.layerViewerTypeEntity.id);
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
                        intervalsCluster +=
                                $scope.layerViewer.parameters[item].int_raioInitial + "~" +
                                $scope.layerViewer.parameters[item].int_initialColor + "~" +
                                $scope.layerViewer.parameters[item].int_finalColor + "~" +
                                $scope.layerViewer.parameters[item].int_opacity + "@~";
                    }

                    $scope.layerViewer.ds_param_names = "initialColor~ini_initialColor~ini_finalColor~opacityFinal~raioFinal~fim_initialColor~fim_initialColor~opacityFinal";
                    $scope.layerViewer.ds_param_values =
                            $scope.layerViewer.raioInitial + "~" +
                            $scope.layerViewer.ini_initialColor + "~" +
                            $scope.layerViewer.ini_finalColor + "~" +
                            $scope.layerViewer.opacityFinal + "@~" +
                            intervalsCluster +
                            $scope.layerViewer.raioFinal + "~" +
                            $scope.layerViewer.fim_initialColor + "~" +
                            $scope.layerViewer.fim_initialColor + "~" +
                            $scope.layerViewer.opacityFinal + "~" +
                            countIntervals;
                    break;
            }

            LayerViewerService.save($scope.layerViewer).then(function () {
                $location.path('maps/layer-viewer');
            }, function (response) {
                console.log("ERRO AO SALVAR", response);
            });
        };
    });
});

