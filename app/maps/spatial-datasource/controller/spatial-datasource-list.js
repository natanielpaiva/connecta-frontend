define([
    "connecta.maps",
    "maps/spatial-datasource/service/spatial-datasource-service"
], function (maps) {

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

                    var queryString = getQueryString(params);

                    SpatialDataSourceService.list(queryString).then(onSuccess, onError);

                    function onSuccess(response) {
                        $scope.tableOfDataSourcesParams.total(response.data.totalDocuments);
                        $defer.resolve(response.data.content);
                    }

                    function onError(err) {
                        throw Error(err);
                    }

                }
            }
        }

        function getQueryString (params) {

            var array = [],
                  fieldObj,
              queryString;

            for (var field in $scope.tableOfDataSourcesParams.filter()) {
                fieldObj = {};
                fieldObj[field] = $scope.filter;
                array.push(fieldObj);
            }

            queryString = "?size=" + params.count() +
                          "&page=" + params.page();

            if ($scope.filter) {
                queryString += "&filter=" + JSON.stringify(array);
            }

            return queryString;
        }

    });

});
