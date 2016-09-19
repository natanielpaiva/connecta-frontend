define([
  "connecta.maps",
  "maps/datasource/service/datasource-service"
], function (maps) {

  return maps.lazy.controller("DatasourceFormController", function ($scope, DatasourceService, $location, $routeParams, notify) {
    $scope.datasource = {};
    var isEdit = false;

    if ($routeParams.id) {
      DatasourceService.get($routeParams.id).then(onSuccess, onError);
      function onSuccess(response) {
        $scope.datasource = response.data;
        isEdit = true;
      }

      function onError(error) {
        if (error) {
          notify.error(error.statusText);
        } else {
          notify.error("DATASOURCE.ERROR_OPERATION");
        }
      }

    }


    $scope.save = function (datasource) {
      if (isEdit) {
        update(datasource._id, datasource);
        return;
      }

      DatasourceService.save(datasource).then(onSuccess, onError);

      function onSuccess(response) {
        $location.path("/maps/datasource/" + response.data._id + "/edit");
        notify.success("DATASOURCE.SAVE_SUCCESS");
      }

      function onError(error) {
        if (error) {
          notify.error(error.statusText);
        } else {
          notify.error("DATASOURCE.ERROR_OPERATION");
        }
      }

    };


    function update(id, datasource) {

      DatasourceService.update(id, datasource).then(onSuccess, onError);

      function onSuccess(response) {
        $location.path("/maps/datasource");
        notify.success("DATASOURCE.SAVE_SUCCESS");
      }

      function onError(error) {

        if (error) {
          notify.error(error.statusText);
        } else {
          notify.error("DATASOURCE.ERROR_OPERATION");
        }

      }
    }


  });

});
