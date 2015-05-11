define([
    'connecta.maps',
    'maps/layer/service/layer-service'
], function (maps) {
    return maps.lazy.controller('LayerFormController', function ($scope, LayerService, $location, $routeParams) {
        $scope.layer = null;
        $scope.isEditing = false;

        if ($routeParams.id) {
            $scope.isEditing = true;
            LayerService.get($routeParams.id).success(function (data) {
                $scope.layer = data;
            });
        }

        $scope.getLayer = function (typeLayerSource) {
            
        };
        

        $scope.submit = function () {
            LayerService.save($scope.layer).then(function () {
                $location.path('maps/layer');
            }, function (response) {
            });
        };
    });
});