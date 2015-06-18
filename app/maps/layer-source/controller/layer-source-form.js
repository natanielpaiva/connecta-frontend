define([
    'connecta.maps',
    'maps/layer-source/service/layer-source-service',
    'maps/layer-source-type/service/layer-source-type-service',
    'portal/layout/service/notify'
], function (maps) {
    return maps.lazy.controller('LayerSourceFormController', function ($scope, LayerSourceService, notify, LayerSourceTypeService, $location, $routeParams, $translate) {
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
                var interval = setInterval(function () {
                    if ($scope.formulario.nm_source.$viewValue !== "") {
                        angular.element("#layerSourceTypeEntity").find("option[label='" + $scope.layerSource.layerSourceTypeEntity.ds_source_type + "']").attr('selected', 'true');
                        angular.element('input[name="'+$scope.layerSource.layerSourceTypeEntity.ds_source_type+'"]').attr('checked', true)
                        clearInterval(interval);
                    }

                });
            });
        } else {

            var interval = setInterval(function () {
                if (angular.element("#ds_link_interno")) {
                    angular.element("#ds_link_interno").val("http://");
                    angular.element("#ds_link_externo").val("http://");
                    clearInterval(interval);
                }

            });
        }
        ;



        $scope.submit = function () {
            LayerSourceTypeService.get($scope.layerSource.layerSourceTypeEntity).then(function (response) {
                $scope.layerSource.layerSourceTypeEntity = response.data;
                LayerSourceService.save($scope.layerSource).then(function () {
                    $translate('LAYERSOURCE.ADDED_SUCCESS').then(function (text) {
                        notify.success(text);
                    });
                    $location.path('maps/layer-source');
                }, function (response) {
                    notify.error(response);
                });
            });

        };
    });
});