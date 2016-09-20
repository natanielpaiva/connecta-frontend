define([
  "connecta.maps",
  "maps/datasource/service/datasource-service"
], function (maps) {

  return maps.lazy.controller("DatasourceViewController", function ($scope, DatasourceService, $routeParams, $location, notify) {
    $scope.datasource = {};

    if($routeParams.id){

      DatasourceService.get($routeParams.id).then(onSuccessGet, onErrorGet);

    }

    $scope.delete = function(id){

      DatasourceService.delete(id).then(onSuccessSave, onErrorSave);
    };

    function onSuccessSave(){
      $location.path("/maps/datasource");
      notify.info("DATASOURCE.DELETE_SUCCESS");
    }

    function onErrorSave(error){
      if(error){
        notify.error(error.statusText);
      }else{
        notify.error("DATASOURCE.DELETE_ERROR");
      }
    }

    function onSuccessGet(response){
      $scope.datasource = response.data;
    }

    function onErrorGet(error) {
      if(error){
        notify.error(error.statusText);
      }else{
        notify.error("DATASOURCE.ERROR_OPERATION");
      }
    }

  });

});
