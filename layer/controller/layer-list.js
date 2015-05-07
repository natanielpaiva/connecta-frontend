define([
    'connecta.maps',
    'maps/layer/service/layer-service'
], function (maps) {
    return maps.lazy.controller('LayerListController', function ($scope, LayerService) {

        $scope.layers = null;

        LayerService.list().then(function (response) {
            $scope.layers = response.data;
        }, function (response) {});
        
    });
});