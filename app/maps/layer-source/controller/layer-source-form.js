define([
    'connecta.maps',
    'maps/layer-source/service/layer-source-service'
], function (maps) {
    return maps.lazy.controller('LayerSourceFormController', function ($scope, LayerSourceService, $location, $routeParams) {
        $scope.layerSource = null;
        $scope.isEditing = false;

        if ($routeParams.id) {
            $scope.isEditing = true;
            LayerSourceService.get($routeParams.id).success(function (data) {
                $scope.layerSource = data;
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