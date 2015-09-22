define([
    'connecta.maps',
    'maps/layer-viewer-group/service/layer-viewer-group-service'
], function (maps) {
    return maps.lazy.controller('LayerViewerGroupListController', function ($scope, LayerViewerGroupService) {

        $scope.layerViewersGroup = null;

        LayerViewerGroupService.list().then(function (response) {
            $scope.layerViewersGroup = response.data;
            console.log("$scope.layerViewerGroup",$scope.layerViewersGroup);
        }, function (response) {});
        
    });
});