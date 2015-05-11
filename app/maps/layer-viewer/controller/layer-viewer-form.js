define([
    'connecta.maps',
    'maps/layer-viewer/service/layer-viewer-service'
], function (presenter) {
    return presenter.lazy.controller('LayerViewerFormController', function ($scope, LayerViewerService, $location, $routeParams) {
        
        $scope.types = LayerViewerService.getTypes();

        $scope.layerViewer = {
            parameters: []
        };

        if ($routeParams.id) {
            LayerViewerService.getById($routeParams.id).then(function (response) {
                $scope.layerViewer = response.data;
            });
        } else {
            $scope.layerViewer.type = Object.keys($scope.types)[0];
        }

        $scope.submit = function () {
            LayerViewerService.save($scope.datasource).then(function () {
                $location.path('maps/layer-viewer');
            });
        };
    });
});