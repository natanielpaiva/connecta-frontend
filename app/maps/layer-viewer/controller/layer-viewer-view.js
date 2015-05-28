define([
    'connecta.maps',
    'maps/layer-viewer/service/connecta-geo-service',
    'maps/layer-viewer/service/layer-viewer-service',
    'portal/layout/service/modalTranslate',
    'portal/layout/service/notify'
], function (maps) {
    return maps.lazy.controller('LayerViewerViewController', function ($scope, LayerViewerService, notify, ConnectaGeoService, $routeParams, $location, $modalTranslate, $translate) {


        LayerViewerService.getById($routeParams.id).then(function (response) {

            $scope.layerViewer = response.data;

            $scope.remove = function (id) {
                LayerViewerService.delete(id).then(function () {
                    $translate('LAYERVIEWER.REMOVE_SUCCESS').then(function (text) {
                        notify.success(text);
                        $location.path('maps/layer-viewer');
                    });
                }, function (response) {
                    $translate('LAYERVIEWER.ERROR_REMOVING').then(function (text) {
                        notify.error(text);
                        $location.path('maps/layer-viewer');
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
            $modalTranslate($scope.modalParams, 'title', 'LAYERVIEWER.TITLE_CONFIRM_DELETE');
            $modalTranslate($scope.modalParams, 'text', 'LAYERVIEWER.CONFIRM_DELETE');


            ConnectaGeoService.showViewer($scope.layerViewer);


        });

    });
});