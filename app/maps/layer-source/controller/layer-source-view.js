define([
    'connecta.maps',
    'maps/layer-source/service/layer-source-service',
    'portal/layout/service/modalTranslate'
], function (maps) {
    return maps.lazy.controller('LayerSourceViewController', function ($scope, LayerSourceService, $routeParams, $location, $modalTranslate) {


        LayerSourceService.get($routeParams.id).then(function (response) {
            $scope.layerSource = response.data;


            //Parâmetros da Modal
            $scope.modalParams = {
                title: "",
                text: "",
                size: 'sm',
                success: $scope.remove
            };

            //translate das propriedades da modal
            $modalTranslate($scope.modalParams, 'title', 'LAYERSOURCE.TITLE_CONFIRM_DELETE');
            $modalTranslate($scope.modalParams, 'text', 'LAYERSOURCE.CONFIRM_DELETE');


            $scope.remove = function (id) {
                LayerSourceService.delete(id).then(function () {
                    $location.path('maps/layer-source');
                });
            };
        });

    });
});