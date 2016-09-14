define([
    "connecta.maps",
    "maps/helper/filter",
    "maps/spatial-datasource/service/spatial-datasource-service"
], function (maps, filterHelper) {

    return maps.lazy.controller("SpatialDataSourceListController", function ($scope, SpatialDataSourceService, ngTableParams) {

        $scope.tableOfDataSourcesParams = new ngTableParams({
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

                    var queryString = filterHelper.getQueryString(params, $scope.filter, $scope.tableOfDataSourcesParams.filter());

                    SpatialDataSourceService.list(queryString).then(onSuccess, onError);

                    function onSuccess(response) {
                        $scope.tableOfDataSourcesParams.total(response.data.totalDocuments);
                        $defer.resolve(response.data.content);
                    }

                    function onError(err) {
                        throw Error(err);
                    }

                }
            };
        }

    });

});
