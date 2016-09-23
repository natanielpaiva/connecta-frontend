define([
  'connecta.maps',
  '../service/analysis-service',
  '../../project/service/project-service'
], function (maps) {

  return maps.lazy.controller('AnalysisFormController', function ($scope, AnalysisService, ProjectService) {

    $scope.analysis = {
      popupConfig: {
        enabled: false,
        positioning: 'tooltip'
      },
      allowDrill: false,
      outFields: []
    };

    ProjectService.list({size: '*'})
      .catch(function (err) {
        console.error(err);
      })
      .then(function (response) {
        console.log(response.data.content);
        $scope.projects = response.data.content;
      });

    $scope.projectChanged = function (project) {
      $scope.analysis.project = project;
    };

    $scope.richLayerChanged = function (richLayer) {
      $scope.analysis.richLayer = richLayer;
    };

    $scope.editOutField = function (variableIndex) {
      console.info($scope.analysis.outFields[variableIndex]);
    };

    $scope.save = function () {
      AnalysisService.save($scope.analysis)
        .catch(function (err) {
          console.error(err);
        })
        .then(function (response) {
          console.info(response);
        });
    };

  });

});
