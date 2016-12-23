define([
    "connecta.maps",
    "maps/datasource/storage/context",
    "maps/datasource/service/datasource-service"
], function (maps, contextConfig) {

    return maps.lazy.controller("DatasourceFormController", function ($scope, DatasourceService, $location, $routeParams) {
        $scope.datasource = {};
        var isEdit = false;
        $scope.listAnalysis = [];

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

        $scope.saveDatasource = function (datasource) {
            try {
                if (datasource._id) {
                    update(datasource._id, datasource);
                } else {
                    save(datasource);
                }
            } catch (error) {
                notify.error(error);
            }
        };

        function save(datasource) {
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
            var promise = DatasourceService.update(id, datasource);
            promise.catch(function (error) {
                notify.error(error);
            });
            promise.then(function (response) {
                $location.path("/maps/datasource");
            });
        }

        $scope.contextTemplate = contextConfig;

        $scope.onServerChange = function (context) {
            if (context) {
                context = context.toLowerCase();
            }

            if (context === "connecta") {
                var promise = DatasourceService.listAnalysisConnecta();
                promise.catch(function (error) {
                    console.error(error);
                });

                promise.then(function (response) {
                    $scope.listAnalysis = response.data;
                });
            }

            $scope.currentState = context;
        };


    });

});
