define([
    "connecta.maps",
    "../service/analysis-service",
    "../../project/service/project-service"
], function (maps) {

    return maps.lazy.controller("AnalysisViewController", function ($scope, $location, $routeParams, AnalysisService, ProjectService, notify) {

        init();

        function init() {
            loadAnalysis();
        }

        function loadAnalysis() {
            AnalysisService.get($routeParams.id)
                .catch(function (err) {
                    notify.error(err.statusText);
                })
                .then(function (response) {
                    var analysis = response.data;
                    $scope.analysis = {
                        _id: analysis._id,
                        title: analysis.title,
                        allowDrill: analysis.allowDrill,
                        popupConfig: analysis.popupConfig,
                        outFields: analysis.outFields,
                        projectId: analysis.projectId
                    };

                    ProjectService.get(analysis.projectId)
                        .catch(function (err) {
                            console.error(err);
                        })
                        .then(function (response) {
                            var project = response.data;
                            $scope.analysis.project = project;
                            var filteredRichLayers = project.richLayers.filter(function (richLayer) {
                                return richLayer._id === analysis.richLayerId;
                            });
                            if (filteredRichLayers.length) {
                                $scope.analysis.richLayer = filteredRichLayers[0];
                            }
                        });
                });
        }


        $scope.delete = function () {
            AnalysisService.delete($scope.analysis._id)
                .catch(function (err) {
                    notify.error("ANALYSIS.DELETE_ERROR");
                })
                .then(function (response) {
                    $location.path('/maps/analysis');
                    notify.info("ANALYSIS.DELETE_SUCCESS");
                });
        };

    });

});
