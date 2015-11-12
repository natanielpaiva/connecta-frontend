define([
    'connecta.maps',
    'maps/import/service/import-shp-service',
    'maps/layer-source/service/layer-source-service',
    'portal/layout/service/notify'
], function (maps) {
    return maps.lazy.controller('ImportSHPController', function ($scope, ImportSHPService, LayerSourceService, $location, $routeParams, notify,$translate) {

        $scope.nm_layerSource = null;

        LayerSourceService.list().then(function (response) {
            $scope.nm_layerSource = response.data;
        }, function (response) {
        });




        $scope.addFileListener = function () {
            angular.element("#file-original").change(function () {
                console.info("VALUE", this.value);
                if (this.value.substr(this.value.indexOf('.') + 1) !== "zip") {
                    $translate('IMPORT.INVALID_EXTENSION').then(function (text) {
                        notify.info(text);
                    });
                } else {

                    angular.element("#file-falso").val(this.value);
                }
            });
        };


        $scope.addFileListener();



        $scope.submit = function () {
            var formData = new FormData();
            formData.append('layerSourceID', $scope.formulario.nm_layerSourceSHP.$viewValue.id);
            formData.append("file", angular.element('#file-original').get(0).files[0]);
            ImportSHPService.importSHP(formData);


        };
    });
});