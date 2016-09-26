define([
    "connecta.maps",
    "maps/helper/filter",
    "maps/project/service/project-service"
], function (maps, helperFilter) {

    return maps.lazy.controller("ProjectListController", function ($scope, ProjectService, ngTableParams) {


        $scope.tableProjectsParams = new ngTableParams({
            count : 10,
            page : 1,
            filter : {

            }
        }, buildNgTable());

        function buildNgTable () {
            return {
                getData : function ($defer, params) {

                    var queryString = helperFilter.getQueryString(params, $scope.filter, $scope.tableProjectsParams.filter());

                    ProjectService.list(queryString).then(onSuccess, onError);

                    function onSuccess(response) {
                        $scope.tableProjectsParams.total(response.data.totalDocuments);
                        $defer.resolve(response.data.content);
                    }

                    function onError(err) {
                        console.error(err.statusText);
                    }
                }
            };
        }

    });

});
