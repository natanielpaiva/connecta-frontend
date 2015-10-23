define([
    'connecta.portal',
    'presenter/viewer/service/viewer-service'
], function (portal) {
    return portal.lazy.directive('analysisViewer', function () {
        return {
            templateUrl: 'app/presenter/viewer/directive/template/analysis-viewer.html',
            scope: {
                model: '=ngModel'
            },
            controller: function ($scope, ViewerService) {
                if ($scope.model.id !== undefined) {
                    ViewerService.result($scope.model.id).then(function (response) {
                        response.data.analysisViewer.configuration.dataProvider = response.data.result;
                        $scope.model = response.data.analysisViewer;
                    });
                }
            }
        };
    });
});
