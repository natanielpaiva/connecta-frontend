define([
    'connecta.maps',
    'maps/layer/service/layer-service',
    'maps/layer-viewer/service/layer-viewer-service',
    'maps/layer-viewer-group/service/layer-viewer-group-service',
    'portal/layout/service/notify'
], function (maps) {
    return maps.lazy.controller('LayerViewerGroupFormController', function ($scope, LayerService, LayerViewerService, LayerViewerGroupService, notify, $location, $routeParams, $translate) {

        $scope.types = LayerViewerService.getTypes();

        $scope.viewerLayerGroup = [];

        $scope.isEditing = false;

        $scope.layers = [];

        $scope.layerColumns = [];

        $scope.viewerLayer = [];
        //escuta o obj de parameters para saber quando se adicionou uma novo combo de intervalo
        $scope.$watch('layerViewerGroup.viewerTypeImplEntity.id', function (val) {
            console.log("val", val);

            if (typeof val !== 'undefined') {


                // 1 - serviço Openlayers || 2 - serviço ESRI
                var layerByType = (val === 1 || val === "1") ? LayerViewerService.list() : console.log("serviço viewers ESRI");

                layerByType.then(function (result) {
                    $scope.viewerLayer = result.data;
                    console.log("trouxe", result);

                }, function () {
                    console.info("ERROR");
                });
            }
        });

        //Realiza a transicao do registro de um campo para o outro
        $scope.parseDataLayerGroup = function (id) {
            for (var item = 0; item < $scope.viewerLayer.length; item++) {
                if ($scope.viewerLayer[item].id == id) {

                    //adiciona o registro no outro array
                    $scope.viewerLayerGroup.push($scope.viewerLayer[item]);

                    //deleta o registro do array
                    $scope.viewerLayer.splice(item, 1);

                    break;
                } else {
                    console.log("saiu", $scope.viewerLayer[item]);
                }
            }
        };

        //Realiza a transicao do registro de um campo para o outro
        $scope.parseDataLayer = function (id) {
            for (var item = 0; item < $scope.viewerLayerGroup.length; item++) {
                if ($scope.viewerLayerGroup[item].id == id) {

                    //adiciona o registro no outro array
                    $scope.viewerLayer.push($scope.viewerLayerGroup[item]);

                    //deleta o registro do array
                    $scope.viewerLayerGroup.splice(item, 1);

                    break;
                } else {
                    console.log("saiu", $scope.viewerLayerGroup[item]);
                }
            }
        };

        $scope.submit = function () {

            //salvar o nome do grupo




            // preparando os id's das layers
            var objLayersGroup = "";
            for (var view in $scope.viewerLayerGroup) {
                if (view == 0 || view == "0") {
                    objLayersGroup += $scope.viewerLayerGroup[view].id;
                }
                objLayersGroup += "#" + $scope.viewerLayerGroup[view].id;
            }

//            $scope.layerViewerGroup

            LayerViewerService.save($scope.layerViewerGroup).then(function () {
                $translate('LAYERVIEWERGROUP.ADDED_SUCCESS').then(function (text) {
                    notify.success(text);
                    $location.path('maps/layer-viewer-group');
                });
            }, function (response) {
                notify.error(response);
            });
        };
    });
});

