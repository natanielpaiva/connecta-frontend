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

                    var objRequest = {
                        size : params.count(),
                        page : params.page(),
                        filter : getObjectFilter()
                    };

                    SpatialDataSourceService.list(objRequest).then(onSuccess, onError);

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

        function getObjectFilter () {
            var array = [],
                  fieldObj;

            if (!$scope.filter)
                return;

            for (var field in $scope.tableOfDataSourcesParams.filter()) {
                fieldObj = {};
                fieldObj[field] = $scope.filter;
                array.push(fieldObj);
            }

            return array;
        }

    });

});
