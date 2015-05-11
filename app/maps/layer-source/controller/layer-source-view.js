define([
    'connecta.maps',
    'maps/layer-source/service/layer-source-service'
], function (maps) {
    return maps.lazy.controller('LayerSourceViewController', function ($scope, LayerSourceService,$routeParams, $location) {
        

        LayerSourceService.get($routeParams.id).then(function (response) {
            $scope.layerSource = response.data;

            

            $scope.remove = function (id) {
                LayerSourceService.delete(id).then(function () {                    
                    $location.path('maps/layer-source');
                });
            };
        });

    });
});