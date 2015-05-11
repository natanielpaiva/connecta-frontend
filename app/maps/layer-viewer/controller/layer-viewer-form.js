define([
    'connecta.maps',
    'maps/layer/service/layer-service',
    'maps/layer-viewer/service/layer-viewer-service'
], function (presenter) {
    return presenter.lazy.controller('LayerViewerFormController', function ($scope, LayerService, LayerViewerService, $location, $routeParams) {

        $scope.types = LayerViewerService.getTypes();

        $scope.isEditing = false;

        $scope.layers = [];

        $scope.layerViewer = {
            parameters: []
        };

        if ($routeParams.id) {
            $scope.isEditing = true;
            LayerViewerService.getById($routeParams.id).then(function (response) {
                $scope.layerViewer = response.data;
            });
        } else {
            $scope.layerViewer.type = Object.keys($scope.types)[0];
        }

        $scope.getLayerByType = function (typeLayer) {

            if (typeLayer === '') {
                $scope.layers = [];
                return false;
            }

            var layerByType = (typeLayer == 1) ? LayerService.list() : LayerService.getByType(1);

            layerByType.then(function (result) {
                $scope.layers = result.data;
            }, function () {
                console.info("ERROR");
            });

        };

        $scope.submit = function () {
            LayerViewerService.save($scope.layerViewer).then(function () {
                $location.path('maps/layer-viewer');
            }, function (response) {
                console.log("ERRO AO SALVAR", response);
            });
        };
    });
});