define([
    'connecta.maps',
    'maps/layer-viewer/service/layer-viewer-service',
    'maps/layer-viewer-group/service/layer-viewer-group-service',
    'maps/layer-viewer-group/service/group-layer-viewer-service',
    'portal/layout/service/notify'
], function (maps) {
    return maps.lazy.controller('LayerViewerGroupFormController', function ($scope, LayerViewerService, LayerViewerGroupService, GroupLayerViewerService, notify, $location, $routeParams, $translate) {

        $scope.types = LayerViewerService.getTypes();

        $scope.layerViewerGroup = [];
        
        $scope.viewerLayerGroups = [];

        $scope.isEditing = false;

        $scope.layers = [];

        $scope.layerColumns = [];

        $scope.viewerLayer = [];
        //escuta o obj de parameters para saber quando se adicionou uma novo combo de intervalo
        $scope.$watch('viewerTypeImplEntity.id', function (val) {
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
                    $scope.viewerLayerGroups.push($scope.viewerLayer[item]);

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
            for (var item = 0; item < $scope.viewerLayerGroups.length; item++) {
                if ($scope.viewerLayerGroups[item].id == id) {

                    //adiciona o registro no outro array
                    $scope.viewerLayer.push($scope.viewerLayerGroups[item]);

                    //deleta o registro do array
                    $scope.viewerLayerGroups.splice(item, 1);

                    break;
                } else {
                    console.log("saiu", $scope.viewerLayerGroups[item]);
                }
            }
        };

        $scope.submit = function () {

            
            var objLayerGroup = {"nm_viewer_group": $scope.layerViewerGroup.nm_viewer_group};
            
            LayerViewerGroupService.save(objLayerGroup).then(function (data) {
                console.log("daaaata",data);
                // preparando os id's das layers
                var idLayersGroup = "";
                
                for (var view in $scope.viewerLayerGroups) {
                    if (view === 0 || view === '0') {
                        idLayersGroup += $scope.viewerLayerGroups[view].id;
                    } else {
                        idLayersGroup += "#" + $scope.viewerLayerGroups[view].id;
                    }
                }
//                lool = GroupLayerViewerService.list();
                
//                var objLayerGroup = {
////                    "id_viewer_group": parseInt(data.data.id),
//                    "id_relation": parseInt(data.data.id),
//                    "ds_viewers": idLayersGroup
//                };
                var objLayerGroup = {
//                    "id_viewer_group": parseInt(data.data.id),
                    "layerViewerGroupEntity": {"id": 4},
                    "ds_viewers": "lala"
                };
                GroupLayerViewerService.save(objLayerGroup).then(function (data) {
                    console.log("ahsuahusha",data);
                    
                    
                    
                    $translate('LAYERVIEWERGROUP.ADDED_SUCCESS').then(function (text) {
                        notify.success(text);
                        $location.path('maps/layer-viewer-group');
                    });
                    
                });
            }, function (response) {
                notify.error(response);
            });
        };
    });
});

