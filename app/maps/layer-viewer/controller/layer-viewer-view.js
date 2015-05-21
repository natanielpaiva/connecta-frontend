define([
    'connecta.maps',
    'maps/layer-viewer/service/connecta-geo-service',
    'maps/layer-viewer/service/layer-viewer-service'
], function (maps) {
    return maps.lazy.controller('LayerViewerViewController', function ($scope, LayerViewerService, ConnectaGeoService, $routeParams, $location) {


        LayerViewerService.getById($routeParams.id).then(function (response) {

            $scope.layerViewer = response.data;

            ConnectaGeoService.showViewer($scope.layerViewer);

            $scope.remove = function (id) {
                LayerViewerService.delete(id).then(function () {
                    $location.path('maps/layer-viewer');
                });
            };
        });

    });
});