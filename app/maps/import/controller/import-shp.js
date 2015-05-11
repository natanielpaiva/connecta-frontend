define([
    'connecta.maps',
    'maps/import/service/import-shp-service',
    'maps/layer-source/service/layer-source-service'
], function (maps) {
    return maps.lazy.controller('ImportSHPController', function ($scope, ImportSHPService, LayerSourceService, $location, $routeParams) {

        $scope.nm_layerSource = null;

        LayerSourceService.list().then(function (response) {
            $scope.nm_layerSource = response.data;
        }, function (response) {
        });


        $scope.submit = function () {
            
            


        };
    });
});