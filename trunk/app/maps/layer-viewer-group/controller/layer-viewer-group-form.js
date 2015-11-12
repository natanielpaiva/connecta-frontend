define([
    'connecta.maps',
    'maps/layer-viewer/service/layer-viewer-service',
    'maps/layer-viewer-group/service/layer-viewer-group-service',
    'maps/layer-viewer-group/service/group-layer-viewer-service',
    'portal/layout/service/notify'
], function (maps) {
    return maps.lazy.controller('LayerViewerGroupFormController', function ($scope, LayerViewerService, LayerViewerGroupService, GroupLayerViewerService, notify, $location, $routeParams, $translate) {

        $scope.types = LayerViewerService.getTypes();

        $scope.layerViewerGroup = null;

        $scope.groupLayerViewer = null;

        $scope.viewerLayerGroups = [];

        $scope.isEditing = false;

        $scope.layers = [];

        $scope.layerColumns = [];

        $scope.viewerLayer = [];
        
         if ($routeParams.id) {
            $scope.isEditing = true;            
        }
        
        
        
        

        //escuta o obj de parameters para saber quando se adicionou uma novo combo de intervalo
        $scope.$watch('viewerTypeImplEntity.id', function (val) {

            //quando for um novo cadastro
            if (typeof val !== 'undefined') {


                // 1 - serviço Openlayers || 2 - serviço ESRI
                var layerByType = (val === 1 || val === "1") ? LayerViewerService.list() : console.log("serviço viewers ESRI");

                layerByType.then(function (result) {
                    $scope.viewerLayer = result.data;
                    console.log("trouxe", result);

                }, function () {
                    console.info("ERROR");
                });
            } else {

                GroupLayerViewerService.get($routeParams.id).then(function (result) {
                    $scope.groupLayerViewer = result.data;

                    $scope.layerViewerGroup = $scope.groupLayerViewer.layerViewerGroupEntity;
                    console.log("$scope.groupLayerViewer ", $scope.groupLayerViewer);
                    var dsViewers = $scope.groupLayerViewer.ds_viewers.split("#");

                    var temp = setInterval(function () {

                        //setando o valor do tipo de implementacao
                        angular.element("#viewerTypeImplEntity").val(1);
                        angular.element("#viewerTypeImplEntity").change();

                        var temp2 = setInterval(function () {

                            //levando os viewers para o lado escolhido
                            for (var dsViewer in dsViewers) {
                                console.log("dsViewers[dsViewer].id", dsViewers[dsViewer]);
                                angular.element("#" + dsViewers[dsViewer]).click();
                            }
                            clearInterval(temp2);
                        }, 200);
                        clearInterval(temp);
                    }, 50);

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
            console.log("$scope.layerViewerGroup", $scope.layerViewerGroup);
            LayerViewerGroupService.save($scope.layerViewerGroup).then(function (data) {

                    var idLayersGroup = "";

                for (var view in $scope.viewerLayerGroups) {
                    if (view === 0 || view === '0') {
                        idLayersGroup += $scope.viewerLayerGroups[view].id;
                    } else {
                        idLayersGroup += "#" + $scope.viewerLayerGroups[view].id;
                    }
                }
                if (!$routeParams.id) {
                    
                    // criando objeto para novo grupo
                    $scope.groupLayerViewer = {
                        "layerViewerGroupEntity": {"id": data.data.id},
                        "ds_viewers": idLayersGroup
                    };

                } else {
                    
                    // atualizando valor de layers para update
                    $scope.groupLayerViewer.ds_viewers = idLayersGroup;
                }

                GroupLayerViewerService.save($scope.groupLayerViewer).then(function (data) {

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

