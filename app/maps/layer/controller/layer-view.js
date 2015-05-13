define([
    'connecta.maps',
    'maps/layer/service/layer-service'
], function (maps) {
    return maps.lazy.controller('LayerViewController', function ($scope, LayerService,$routeParams, $location) {
        

        LayerService.get($routeParams.id).then(function (response) {
            $scope.layer = response.data;

            

            $scope.remove = function (id) {
                LayerService.delete(id).then(function () {
                    $location.path('maps/layer');
                });
            };
        });

    });
});