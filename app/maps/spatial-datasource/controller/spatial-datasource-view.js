define([
  "connecta.maps",
  "maps/spatial-datasource/service/spatial-datasource-service"
], function (maps) {


  return maps.lazy.controller("SpatialDataSourceViewController", function ($scope, $routeParams, SpatialDataSourceService, $location, notify) {

    if ($routeParams.id) {

      DatasourceService.get($routeParams.id).then(onSuccess, onError);

      function onSuccess(response) {
        $scope.spatialDataSource= response.data;
      }

      function onError(error) {
        if (error) {
          notify.error(error.statusText);
        } else {
          notify.error("DATASOURCE.ERROR_OPERATION");
        }
      }
    }


    $scope.delete = function (id) {
      SpatialDataSourceService.delete(id).then(onSuccess, onError);

      function onSuccess() {
        $location.path("/maps/spatial-datasource");
        notify.info("GEO_DATASOURCE.DELETE_SUCCESS");
      }

      function onError(error) {
        if (error) {
          notify.error(error.statusText);
        } else {
          notify.error("GEO_DATASOURCE.DELETE_ERROR");
        }
      }
    };

  });
});
