define([
  "connecta.maps",
  "maps/spatial-datasource/service/spatial-datasource-service"
], function (maps) {

    return maps.lazy.controller("SpatialDataSourceFormController", function ($scope, SpatialDataSourceService, $location, $routeParams, notify) {
        $scope.spatialDataSource = {};
        var isEdit = false;

        if ($routeParams.id) {
            SpatialDataSourceService.get($routeParams.id).success(function (data) {
                $scope.spatialDataSource = data;
                isEdit = true;
            });
        }

        $scope.save = function (spatialDataSource) {
            testeConnectionObiee(spatialDataSource);
            if (isEdit) {
                update(spatialDataSource._id, spatialDataSource);
                return;
            }

            SpatialDataSourceService.save(spatialDataSource).then(function (response) {
                $location.path("/maps/spatial-datasource/" + response.data._id + "/edit");
                notify.success("GEO_DATASOURCE.SAVE_SUCCESS");
            }, function (error) {
                notify.error("GEO_DATASOURCE.SAVE_ERROR");
            });
        };

        $scope.backToList = function () {
            $location.path("/maps/spatial-datasource");
        };

        function testeConnectionObiee(spatialDataSource){
            var params = {
                location: spatialDataSource.dsn,
                user: spatialDataSource.user,
                password: spatialDataSource.password
            };
            var promise = SpatialDataSourceService.testeConnectionObiee(params);
            promise.catch(function(error){
                notify.error("Erro na conexão com o OBIEE");
            });

            promise.then(function (response) {
                notify.success("deu bom");
            });

        }

        function update(id, spatialDataSource) {
            SpatialDataSourceService.update(id, spatialDataSource).then(function (response) {
                $scope.backToList();
                notify.success("GEO_DATASOURCE.SAVE_SUCCESS");
            }, function (error) {
                notify.error("GEO_DATASOURCE.SAVE_ERROR");
            });
        }

    });

});
