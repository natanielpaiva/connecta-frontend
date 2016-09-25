define([
    "connecta.maps",
    "../service/analysis-service"
], function (maps) {

    return maps.lazy.controller("AnalysisViewController", function ($scope, $location, $routeParams, AnalysisService) {

      AnalysisService.get($routeParams.id)
        .catch(function (err) {
          console.error(err);
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

      $scope.delete = function () {
        AnalysisService.delete($scope.analysis._id)
          .catch(function (err) {
            console.error(err);
          })
          .then(function (response) {
            console.info(response);
            $location.path('/maps/analysis');
          });
      };

    });

});
