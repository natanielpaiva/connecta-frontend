define([
    "connecta.maps",
    "../service/analysis-service"
], function (maps) {

    return maps.lazy.controller("AnalysisViewController", function ($scope, $location, $routeParams, AnalysisService, notify) {

        init();

        function init() {
            checkEdit();
        }

        function checkEdit() {
            AnalysisService.get($routeParams.id)
                .catch(function (err) {
                    notify.error(err);
                })
                .then(function (response) {
                    var analysis = response.data;
                    $scope.analysis = {
                        _id: analysis._id,
                        title: analysis.title,
                        allowDrill: analysis.allowDrill,
                        popupConfig: analysis.popupConfig,
                        outFields: analysis.outFields,
                        project: analysis.project
                    };
                });
        }


        $scope.delete = function () {
            AnalysisService.delete($scope.analysis._id)
                .catch(function (err) {
                    notify.error(err);
                })
                .then(function (response) {
                    notify.info(response);
                    $location.path('/maps/analysis');
                });
        };

    });

});
