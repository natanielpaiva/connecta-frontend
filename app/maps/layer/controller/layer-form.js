define([
    'connecta.maps',
    'maps/layer-source/service/layer-source-service',
    'maps/layer/service/layer-service'
], function (maps) {
    return maps.lazy.controller('LayerFormController', function ($scope, LayerService, LayerSourceService, $location, $routeParams) {
        $scope.layer = null;
        $scope.isEditing = false;
        $scope.layerSource = null;


        LayerSourceService.list().then(function (response) {            
            $scope.layerSourceType = response.data;
        }, function (response) {
            console.info("error", response);
        });


        if ($routeParams.id) {
            $scope.isEditing = true;
            LayerService.get($routeParams.id).success(function (data) {
                $scope.layer = data;
            });
        }

        $scope.getLayersBySource = function (idLayerSource) {                 
            LayerService.getLayersBySource(idLayerSource, $scope);
            LayerSourceService.get(idLayerSource).success(function (response) {
                $scope.layerSource = response;
            });
        };

        $scope.getLayerConfigs = function (layerName) {            
            LayerService.getLayerColumns($scope.layerSource.ds_link_interno, layerName, $scope);
            LayerService.getLayerGeometryType($scope.layerSource.ds_link_interno, layerName, $scope);
        };


        $scope.submit = function () {
            $scope.layer.txt_columns = $scope.layerCOLUMNS;
            $scope.layer.geometryTypeEntity = {id: $scope.layerGeometryType};
            $scope.layer.nm_layer = $scope.layer.layerName.layerName;
            delete $scope.layer.layerName;
            LayerService.save($scope.layer).then(function () {
                $location.path('maps/layer');
            }, function (response) {
            });
        };
    });
});