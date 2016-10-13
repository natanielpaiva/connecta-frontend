define([
    "connecta.maps",
    "../service/viewer-service",
    "../../project/service/project-service"
], function (maps) {

    return maps.lazy.controller("ViewerViewController", function ($scope, $location, $routeParams, ViewerService, ProjectService, notify) {

        init();

        function init() {
            loadViewer();
        }

        function loadViewer() {
            ViewerService.get($routeParams.id)
                .catch(function (err) {
                    notify.error(err.statusText);
                })
                .then(function (response) {
                    var viewer = response.data;
                    $scope.viewer = {
                        _id: viewer._id,
                        title: viewer.title,
                        allowDrill: viewer.allowDrill,
                        popupConfig: viewer.popupConfig,
                        projectId: viewer.projectId
                    };

                    ProjectService.get(viewer.projectId)
                        .catch(function (err) {
                            console.error(err);
                        })
                        .then(function (response) {
                            var project = response.data;
                            $scope.viewer.project = project;
                            var filteredRichLayers = project.richLayers.filter(function (richLayer) {
                                return richLayer._id === viewer.initialRichLayerId;
                            });
                            if (filteredRichLayers.length) {
                                $scope.viewer.richLayer = filteredRichLayers[0];
                            }
                        });
                });
        }


        $scope.delete = function () {
            ViewerService.delete($scope.viewer._id)
                .catch(function (err) {
                    notify.error("VIEWER.DELETE_ERROR");
                })
                .then(function (response) {
                    $location.path('/maps/viewer');
                    notify.info("VIEWER.DELETE_SUCCESS");
                });
        };

    });

});
