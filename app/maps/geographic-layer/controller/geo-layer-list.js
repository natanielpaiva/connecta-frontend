define([
    "connecta.maps",
    "maps/helper/filter",
    "maps/geographic-layer/service/geo-layer-service"
], function (maps, filterHelper) {

    return maps.lazy.controller("GeoLayerListController", function ($scope, GeoLayerService, ngTableParams, notify) {

        $scope.geometryMap = {
            esriGeometryPolygon : "Polígono",
            esriGeometryPoint : "Ponto",
            esriGeometryPolyline : "Linhas",
            esriGeometryMultipoint : "Pontos"
        };

        $scope.tableLayerParams = new ngTableParams({
            page : 1,
            count : 10,
            filter : {}
        }, buildNgTable());

        function buildNgTable () {
            return {
                getData : function ($defer, params) {

                    var queryString = filterHelper.getQueryString(params, $scope.filter, $scope.tableLayerParams.filter());

                    GeoLayerService.list(queryString).then(onSuccess, onError);

                    function onSuccess(response) {
                        if (!response) {
                            return notify.error('Não foi possível obter resposta do servidor.');
                        }
                        $scope.tableLayerParams.total(response.data.totalDocuments);
                        $defer.resolve(response.data.content);
                    }

                    function onError(err) {
                        notify.error(err);
                    }
                }
            };
        }

    });

});
