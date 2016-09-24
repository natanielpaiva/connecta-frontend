define([
    "connecta.maps",
    "maps/helper/filter",
    "maps/datasource/service/datasource-service"
], function (maps, helperFilter) {

    return maps.lazy.controller("DatasourceListController", function ($scope, ngTableParams, DatasourceService) {

        $scope.tableDataSourcesParams = new ngTableParams({
            count : 10,
            page : 1,
            filter : {

            }
        }, buildNgTable());

        function buildNgTable() {
            return {
                getData : function ($defer, params) {

                    var queryString = helperFilter.getQueryString(params, $scope.filter, $scope.tableDataSourcesParams.filter());

                    DatasourceService.list(queryString).then(onSuccess, onError);

                    function onSuccess (response) {
                        $scope.tableDataSourcesParams.total(response.data.totalDocuments);
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
