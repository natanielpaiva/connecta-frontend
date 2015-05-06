define([
    'connecta.maps',
    'maps/layer-source/service/layer-source-service'
], function (maps) {
    return maps.lazy.controller('LayerSourceListController', function ($scope, LayerSourceService) {

        $scope.layerSources = null;

        LayerSourceService.list().then(function (response) {
            $scope.layerSources = response.data;
        }, function (response) {});
        
    });
});