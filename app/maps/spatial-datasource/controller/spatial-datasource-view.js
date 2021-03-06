define([
    "connecta.maps",
    "maps/spatial-datasource/service/spatial-datasource-service"
], function (maps) {


    return maps.lazy.controller("SpatialDataSourceViewController", function ($scope, $routeParams, SpatialDataSourceService, $location, notify) {

        if ($routeParams.id) {
            SpatialDataSourceService.get($routeParams.id).then(onSuccessGet, onErrorGet);
        }

        $scope.delete = function (id) {
            console.info(id);
            SpatialDataSourceService.delete(id).then(onSuccessDelete, onErrorDelete);
        };

        function onSuccessDelete() {
            $location.path("/maps/spatial-datasource");
            notify.info("GEO_DATASOURCE.DELETE_SUCCESS");
        }

        function onErrorDelete(error) {
            if (error) {
                notify.error(error.statusText);
            } else {
                notify.error("GEO_DATASOURCE.DELETE_ERROR");
            }
        }

        function onSuccessGet(response) {
            $scope.spatialDataSource = response.data;
        }

        function onErrorGet(error) {
            if (error) {
                notify.error(error.statusText);
            } else {
                notify.error("DATASOURCE.ERROR_OPERATION");
            }
        }

    });
});
