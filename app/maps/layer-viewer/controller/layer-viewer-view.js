define([
    'connecta.maps',
    'maps/layer-viewer/service/connecta-geo-service',
    'maps/layer-viewer/service/layer-viewer-service',
    'portal/layout/service/modalTranslate'
], function (maps) {
    return maps.lazy.controller('LayerViewerViewController', function ($scope, LayerViewerService, ConnectaGeoService, $routeParams, $location, $modalTranslate) {


        LayerViewerService.getById($routeParams.id).then(function (response) {

            $scope.layerViewer = response.data;

            $scope.remove = function (id) {
                LayerViewerService.delete(id).then(function () {
                    $location.path('maps/layer-viewer');
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