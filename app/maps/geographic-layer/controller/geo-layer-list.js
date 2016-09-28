define([
    "connecta.maps",
    "maps/helper/filter",
    "maps/geographic-layer/service/geo-layer-service",
    "maps/spatial-datasource/service/spatial-datasource-service"
], function (maps, filterHelper) {

    return maps.lazy.controller("GeoLayerListController", function ($scope, GeoLayerService, SpatialDataSourceService, ngTableParams, notify) {

        $scope.geometryMap = {
            esriGeometryPolygon : "Polígono",
            esriGeometryPoint : "Ponto",
            esriGeometryPolyline : "Linhas",
            esriGeometryMultipoint : "Pontos"
        };

        $scope.tableLayerParams = new ngTableParams({
            page : 1,
            count : 10,
            filter : {
                title : {},
                geometryType : {}
            }
        }, buildNgTable());

        function buildNgTable () {
            return {
                getData : function ($defer, params) {

                    var queryString = filterHelper.getQueryString(params, $scope.filter, $scope.tableLayerParams.filter());

                    GeoLayerService.list(queryString).then(onSuccess, onError);

                    function onSuccess(response) {

                        var promises = [];
                        response.data.content.forEach(function (layer) {
                            promises.push(SpatialDataSourceService.get(layer.spatialDataSourceId));
                        });

                        var promise = Promise.all(promises);
                        promise.catch(function (err) {
                            notify.error(err.statusText);
                        });
                        promise.then(function (result) {
                            response.data.content.forEach(function (layer, index) {
                                layer.spatialDataSource = result[index].data;
                            });
                            $scope.tableLayerParams.total(response.data.totalDocuments);
                            $defer.resolve(response.data.content);
                        });

                    }

                    function onError(err) {
                        notify.error(err.statusText);
                    }
                }
            };
        }

    });

});
