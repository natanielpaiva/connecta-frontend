define([
    "connecta.maps",
    "maps/helper/filter",
    "maps/spatial-datasource/service/spatial-datasource-service"
], function (maps, filterHelper) {

    return maps.lazy.controller("SpatialDataSourceListController", function ($scope, SpatialDataSourceService, ngTableParams) {

        $scope.tableSpatialDataSourcesParams = new ngTableParams({
            page : 1,
            count : 10,
            filter : {
                dsn : {},
                title : {},
                serverType : {}
            }
        }, buildNgTable());

        function buildNgTable () {
            return {
                getData : function ($defer, params) {

                    var queryString = filterHelper.getQueryString(params, $scope.filter, $scope.tableSpatialDataSourcesParams.filter());

                    SpatialDataSourceService.search(queryString).then(onSuccess, onError);

                    function onSuccess(response) {
                        $scope.tableSpatialDataSourcesParams.total(response.data.totalDocuments);
                        $defer.resolve(response.data.content);
                    }

                    function onError(err) {
                        console.error(err);
                    }

                }
            };
        }

    });

});
