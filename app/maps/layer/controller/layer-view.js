define([
    'connecta.maps',
    'maps/layer/service/layer-service',
    'portal/layout/service/modalTranslate',
    'portal/layout/service/notify'
], function (maps) {
    return maps.lazy.controller('LayerViewController', function ($scope, LayerService, notify, $routeParams, $location, $modalTranslate, $translate) {


        LayerService.get($routeParams.id).then(function (response) {
            $scope.layer = response.data;


            $scope.remove = function (id) {
                LayerService.delete(id).then(function () {
                    $translate('LAYER.REMOVE_SUCCESS').then(function (text) {
                        notify.success(text);
                        $location.path('maps/layer');
                    });

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