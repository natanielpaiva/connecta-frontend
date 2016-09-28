define([
    "connecta.maps",
    "maps/helper/filter",
    "maps/analysis/service/analysis-service",
    "maps/project/service/project-service"
], function (maps, helperFilter) {

    return maps.lazy.controller("AnalysisListController", function ($scope, ngTableParams, AnalysisService, ProjectService, notify) {

        $scope.tableAnalysisParams = new ngTableParams({
            count : 10,
            page : 1,
            filter : {
                title: {}
            }
        }, buildNgTable());

        function buildNgTable() {
            return {
                getData : function ($defer, params) {

                    var queryString = helperFilter.getQueryString(params, $scope.filter, $scope.tableAnalysisParams.filter());

                    AnalysisService.list(queryString).then(onSuccess, onError);

                    function onSuccess (response) {
                        var promises = [];
                        response.data.content.forEach(function (analysis) {
                            promises.push(ProjectService.get(analysis.projectId));
                        });

                        var promise = Promise.all(promises);
                        promise.catch(function (err) {
                            notify.error(err.statusText);
                        });
                        promise.then(function (result) {
                            response.data.content.forEach(function (analysis, index) {
                                var project = result[index].data;
                                analysis.project = project;
                                var filteredRichLayers = project.richLayers.filter(filterRichLayers.bind(analysis));
                                if (filteredRichLayers.length) {
                                    analysis.richLayer = filteredRichLayers[0];
                                }
                            });
                            function filterRichLayers(richLayer) {
                                return richLayer._id === this.richLayerId;
                            }
                            $scope.tableAnalysisParams.total(response.data.totalDocuments);
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
