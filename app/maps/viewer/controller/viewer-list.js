define([
    "connecta.maps",
    "maps/helper/filter",
    "../service/viewer-service",
    "maps/project/service/project-service"
], function (maps, helperFilter) {

    return maps.lazy.controller("ViewerListController", function ($scope, ngTableParams, MapsViewerService, ProjectService, notify) {

        $scope.tableViewerParams = new ngTableParams({
            count : 10,
            page : 1,
            filter : {
                title: {}
            }
        }, buildNgTable());

        function buildNgTable() {
            return {
                getData : function ($defer, params) {

                    var queryString = helperFilter.getQueryString(params, $scope.filter, $scope.tableViewerParams.filter());

                    MapsViewerService.list(queryString).then(onSuccess, onError);

                    function onSuccess (response) {
                        var promises = [];
                        response.data.content.forEach(function (viewer) {
                            promises.push(ProjectService.get(viewer.projectId));
                        });

                        var promise = Promise.all(promises);
                        promise.catch(function (err) {
                            notify.error(err.statusText);
                        });
                        promise.then(function (result) {
                            response.data.content.forEach(function (viewer, index) {
                                var project = result[index].data;
                                viewer.project = project;
                                var filteredRichLayers = project.richLayers.filter(filterRichLayers.bind(viewer));
                                if (filteredRichLayers.length) {
                                    viewer.richLayer = filteredRichLayers[0];
                                }
                            });
                            function filterRichLayers(richLayer) {
                                return richLayer._id === this.initialRichLayerId;
                            }
                            $scope.tableViewerParams.total(response.data.totalDocuments);
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
