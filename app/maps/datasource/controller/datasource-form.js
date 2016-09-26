define([
    "connecta.maps",
    "maps/datasource/storage/context",
    "maps/datasource/service/datasource-service"
], function (maps, contextConfig) {

    return maps.lazy.controller("DatasourceFormController", function ($scope, DatasourceService, $location, $routeParams, notify) {
        $scope.datasource = {};
        var isEdit = false;

        init();

        function init() {
          checkEdit();
        }


        function checkEdit() {
          if ($routeParams.id) {
            try {
              var promise = DatasourceService.get($routeParams.id);
              promise.catch(function (error) {
                notify.error(error);
              });
              promise.then(function (response) {
                $scope.datasource = response.data;
                isEdit = true;
              });

            } catch (error) {
              notify.error(error);
            }
          }
        }

        $scope.validateDatasource = function (datasource) {

            if (datasource.serviceType === "obiee") {
                try {
                    var promise = DatasourceService.catalogObiee(datasource.dsn, datasource.user, datasource.password, '/shared');
                    promise.catch(function (error) {
                        notify.error(error);
                        return;
                    });
                    promise.then(function () {
                        try {
                            if(datasource._id){
                                update(datasource._id, datasource);
                            }else{
                                save(datasource);
                            }
                        } catch (error) {
                            notify.error(error);
                        }
                    });
                } catch (error) {
                    notify.error(error);
                }
            } else {
                if(datasource._id){
                    update(datasource._id, datasource);
                }else{
                    save(datasource);
                }
            }
        };

        function save(datasource){
            try {
                var promise = DatasourceService.save(datasource);
                promise.catch(function (error) {
                    notify.error(error);
                });
                promise.then(function(response){
                    $location.path("/maps/datasource");
                });
            } catch (error) {
               notify.error(error);
            }
        }

        function update(id, datasource) {
           var promise =  DatasourceService.update(id, datasource);
            promise.catch(function (error) {
               notify.error(error);
            });
            promise.then(function (response) {
                $location.path("/maps/datasource");
            });
        }

        $scope.contextTemplate = contextConfig;

        $scope.onServerChange = function (context) {
            if (context)
                context = context.toLowerCase();
            $scope.currentState = context;
        };

    });

});
