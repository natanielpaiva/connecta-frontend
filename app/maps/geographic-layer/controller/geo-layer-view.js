define([
    "connecta.maps",
    "maps/geographic-layer/service/geo-layer-service",
    "maps/spatial-datasource/service/spatial-datasource-service"
], function (maps) {

    return maps.lazy.controller("GeoLayerViewController", function ($scope, $routeParams, $location, GeoLayerService, SpatialDataSourceService, notify) {

        var id;

        init();

        function init() {

            id = $routeParams.id;

            getLayer();

        }

        function getLayer() {

            GeoLayerService.get(id).then(onSuccess, onError);

            function onSuccess(response) {
                if (!response) {
                    return notify.error('Não foi possível obter resposta do servidor.');
                }
                $scope.layer = response.data;
                getSpatialDS($scope.layer.spatialDataSourceId);
            }

            function onError(err) {
                notify.error(err);
            }

        }

        function getSpatialDS(id) {
            SpatialDataSourceService.get(id).then(onSuccess, onError);

            function onSuccess(response) {
                $scope.layer.spatialDataSource = response.data;
            }

            function onError(err) {
                notify.error(err);
            }
        }

        $scope.delete = function (id) {
            GeoLayerService.delete(id).then(onSuccess, onError);

            function onSuccess() {
                $location.path('/maps/geo-layer');
                notify.info("GEO_LAYER.DELETE_SUCCESS");
            }

            function onError(error) {
                if (error) {
                    notify.error(error.statusText);
                } else {
                    notify.error("GEO_LAYER.DELETE_ERROR");
                }
            }

        };


    });

});
