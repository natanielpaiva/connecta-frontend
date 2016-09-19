define([
  "connecta.maps",
  "maps/datasource/service/datasource-service"
], function (maps) {

  return maps.lazy.controller("DatasourceViewController", function ($scope, DatasourceService, $routeParams, $location, notify) {
    $scope.datasource = {};

    if($routeParams.id){

      DatasourceService.get($routeParams.id).then(onSuccess, onError);

      function onSuccess(response){
        $scope.datasource = response.data;
      }

      function onError(error) {
        if(error){
          notify.error(error.statusText);
        }else{
          notify.error("DATASOURCE.ERROR_OPERATION");
        }
      }


    }

    $scope.delete = function(id){

      DatasourceService.delete(id).then(onSuccess, onError);

      function onSuccess(){
        $location.path("/maps/datasource");
        notify.info("DATASOURCE.DELETE_SUCCESS");
      }

      function onError(error){
        if(error){
          notify.error(error.statusText);
        }else{
          notify.error("DATASOURCE.DELETE_ERROR");
        }
      }

    };

  });

});
