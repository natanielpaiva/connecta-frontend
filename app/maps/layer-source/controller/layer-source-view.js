define([
    'connecta.maps',
    'maps/layer-source/service/layer-source-service'
], function (maps) {
    return maps.lazy.controller('LayerSourceViewController', function ($scope, LayerSourceService,$routeParams, $location) {
        

        LayerSourceService.getById($routeParams.id).then(function (response) {
            $scope.layerSource = response.data;

            

            $scope.excluir = function (id) {
                LayerSourceService.remove(id).then(function () {
                    $location.path('maps/layer-source');
                });
            };
        });

    });
});