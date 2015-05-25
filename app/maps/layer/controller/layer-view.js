define([
    'connecta.maps',
    'maps/layer/service/layer-service',
    'portal/layout/service/modalTranslate'
], function (maps) {
    return maps.lazy.controller('LayerViewController', function ($scope, LayerService, $routeParams, $location, $modalTranslate) {


        LayerService.get($routeParams.id).then(function (response) {
            $scope.layer = response.data;


            $scope.remove = function (id) {
                LayerService.delete(id).then(function () {
                    $location.path('maps/layer');
                });
            };


            //Parâmetros da Modal
            $scope.modalParams = {
                title: "",
                text: "",
                size: 'sm',
                success: $scope.remove
            };

            //translate das propriedades da modal
            $modalTranslate($scope.modalParams, 'title', 'LAYER.TITLE_CONFIRM_DELETE');
            $modalTranslate($scope.modalParams, 'text', 'LAYER.CONFIRM_DELETE');



        });

    });
});