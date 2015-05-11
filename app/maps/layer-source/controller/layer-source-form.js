define([
    'connecta.maps',
    'maps/layer-source/service/layer-source-service'
], function (maps) {
    return maps.lazy.controller('LayerSourceFormController', function ($scope, LayerSourceService, $location, $routeParams) {
        $scope.layerSource = null;
        
        if ($routeParams.id) {
            //TOOD: Implementar update
        } 
        
        $scope.submit = function () {
            LayerSourceService.save($scope.layerSource).then(function () {
                $location.path('maps/layer-source');
            }, function (response) {});
        };
    });
});