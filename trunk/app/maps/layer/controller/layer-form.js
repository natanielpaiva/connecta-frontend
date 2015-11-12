define([
    'connecta.maps',
    'maps/layer-source/service/layer-source-service',
    'maps/layer/service/layer-service',
    'portal/layout/service/notify'
], function (maps) {
    return maps.lazy.controller('LayerFormController', function ($scope, LayerService, LayerSourceService, notify, $location, $routeParams, $translate) {
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
                $scope.getLayersBySource($scope.layer.layerSourceEntity.id);
                                               
                var interval = setInterval(function () {
                    if ($scope.formulario.ds_layer.$viewValue !== "") {
                        angular.element("#layerSourceEntityID").find("option[label='" + $scope.layer.layerSourceEntity.nm_source + "']").attr('selected', 'true');
                        clearInterval(interval);
                    }

                },50);

            });
        }

        $scope.getLayersBySource = function (idLayerSource) {
            LayerService.getLayersBySource(idLayerSource, $scope);
            LayerSourceService.get(idLayerSource).success(function (response) {
                $scope.layerSource = response;

                if ($scope.isEditing) {
                    
                    var interval=setInterval(function(){
                        if(typeof angular.element("#nm_layer").find("option[label='" + $scope.layer.nm_layer + "']").val() !== 'undefined'){
                            var layerNameValue = angular.element("#nm_layer").find("option[label='" + $scope.layer.nm_layer + "']").val();
                            angular.element("#nm_layer").val(layerNameValue);                        
                            clearInterval(interval);
                        }                        
                    }); 
                }

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
                $translate('LAYER.ADDED_SUCCESS').then(function (text) {
                    notify.success(text);
                    $location.path('maps/layer');
                });
            }, function (response) {
                notify.error(response);
            });
        };
    });
});