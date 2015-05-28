define([
    'connecta.maps',
    'maps/layer-source/service/layer-source-service',
    'portal/layout/service/modalTranslate',
    'portal/layout/service/notify'
], function (maps) {
    return maps.lazy.controller('LayerSourceViewController', function ($scope, LayerSourceService, notify, $routeParams, $location, $modalTranslate, $translate) {


        LayerSourceService.get($routeParams.id).then(function (response) {
            $scope.layerSource = response.data;


            $scope.remove = function (id) {
                console.info("REMOVE LAYERSOURCE");
                LayerSourceService.delete(id).then(function () {
                    $translate('LAYERSOURCE.REMOVE_SUCCESS').then(function (text) {
                        notify.success(text);
                        $location.path('maps/layer-source');
                    });
                }, function (response) {
                    $translate('LAYERSOURCE.ERROR_REMOVING').then(function (text) {
                        notify.error(text);
                        $location.path('maps/layer-source');
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
            $modalTranslate($scope.modalParams, 'title', 'LAYERSOURCE.TITLE_CONFIRM_DELETE');
            $modalTranslate($scope.modalParams, 'text', 'LAYERSOURCE.CONFIRM_DELETE');


        });

    });
});