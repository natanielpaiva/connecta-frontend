define([
    'connecta.maps',
    'maps/layer-viewer/service/layer-viewer-service'
], function (maps) {
    return maps.lazy.controller('LayerViewerListController', function ($scope, LayerViewerService) {

        $scope.layerViewers = null;

        LayerViewerService.list().then(function (response) {
            $scope.layerViewers = response.data;
        }, function (response) {});
        
    });
});