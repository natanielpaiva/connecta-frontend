define([
    "connecta.maps",
    "maps/helper/filter",
    "maps/analysis/service/analysis-service"
], function (maps, helperFilter) {

    return maps.lazy.controller("AnalysisListController", function ($scope, ngTableParams, AnalysisService, notify) {

        $scope.tableAnalysisParams = new ngTableParams({
            count : 10,
            page : 1,
            filter : {

            }
        }, buildNgTable());

        function buildNgTable() {
            return {
                getData : function ($defer, params) {

                    var queryString = helperFilter.getQueryString(params, $scope.filter, $scope.tableAnalysisParams.filter());

                    AnalysisService.list(queryString).then(onSuccess, onError);

                    function onSuccess (response) {
                        if (!response) {
                            return notify.error('Não foi possível obter resposta do servidor.');
                        }
                        $scope.tableAnalysisParams.total(response.data.totalDocuments);
                        $defer.resolve(response.data.content);
                    }

                    function onError(err) {
                        notify.error(err.message);
                    }

                }
            };
        }

    });

});
