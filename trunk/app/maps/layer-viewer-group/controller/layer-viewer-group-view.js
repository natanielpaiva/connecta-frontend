define([
    'connecta.maps',
    'maps/layer-viewer-group/service/connecta-geo-service',
    'maps/layer-viewer-group/service/layer-viewer-group-service',
    'maps/layer-viewer-group/service/group-layer-viewer-service',
    'portal/layout/service/modalTranslate',
    'portal/layout/service/notify'
], function (maps) {
    return maps.lazy.controller('LayerViewerGroupViewController', function ($scope, LayerViewerGroupService, GroupLayerViewerService, notify, ConnectaGeoService, $routeParams, $location, $modalTranslate, $translate) {

        GroupLayerViewerService.getByGroup($routeParams.id).then(function (response) {

            $scope.layerViewerGroup = response.data[0];
            
            //id do nome do visualizaedor
            $scope.idViewer = $scope.layerViewerGroup.layerViewerGroupEntity.id;

            $scope.remove = function (id) {
                
                //exclusao das layers do visualizador
                GroupLayerViewerService.delete(id).then(function () {
                    
                    //exclusao do nome do visualizador
                    LayerViewerGroupService.delete($scope.idViewer).then(function () {
                        $translate('LAYERVIEWERGROUP.REMOVE_SUCCESS').then(function (text) {
                            notify.success(text);
                            $location.path('maps/layer-viewer-group');

                        });
                    }, function (response) {
                        $translate('LAYERVIEWERGROUP.ERROR_REMOVING').then(function (text) {
                            notify.error(text);
                            $location.path('maps/layer-viewer-group');
                        });
                    });
                });
            };


            //Parâmetros da Modal
            $scope.modalParams = {
                title: "",
                text: "",
                size: 'sm',
                success: $scope.remove
            };

            //translate das propriedades da modal
            $modalTranslate($scope.modalParams, 'title', 'LAYERVIEWERGROUP.TITLE_CONFIRM_DELETE');
            $modalTranslate($scope.modalParams, 'text', 'LAYERVIEWERGROUP.CONFIRM_DELETE');


//            ConnectaGeoService.showViewer($scope.layerViewerGroup);

        });

    });
});