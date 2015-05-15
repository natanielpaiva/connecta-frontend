define([
    'connecta.maps',
    'maps/layer-source/service/layer-source-service',
    'maps/layer-source-type/service/layer-source-type-service'
], function (maps) {
    return maps.lazy.controller('LayerSourceFormController', function ($scope, LayerSourceService, LayerSourceTypeService, $location, $routeParams) {
        $scope.layerSource = null;
        $scope.isEditing = false;


        $scope.nm_source_type = null;

        LayerSourceTypeService.list().then(function (response) {
            $scope.nm_source_type = response.data;            
            
        }, function (response) {
        });


        if ($routeParams.id) {
            $scope.isEditing = true;
            LayerSourceService.get($routeParams.id).success(function (data) {
                $scope.layerSource = data;
                
                var interval = setInterval(function(){
                    if($scope.formulario.nm_source.$viewValue !== ""){                        
                        angular.element("#layerSourceTypeEntity").find("option[label='"+$scope.layerSource.layerSourceTypeEntity.ds_source_type+"']").attr('selected','true');
                        clearInterval(interval);
                    }
                    
                });
            });
        }
        
        
               
        $scope.submit = function () {
            LayerSourceService.save($scope.layerSource).then(function () {
                $location.path('maps/layer-source');
            }, function (response) {
            });
        };
    });
});