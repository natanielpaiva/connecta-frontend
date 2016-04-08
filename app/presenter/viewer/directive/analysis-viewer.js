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
                        if ($scope.model.configuration.type !== 'table') {
                            response.data.analysisViewer.configuration.dataProvider = response.data.result;
                            $scope.model = response.data.analysisViewer;
                            $scope.model.configuration.export = {enabled: true};
                        }else{
                            response.data.analysisViewer.configuration.data = response.data.result;
                            $scope.model = response.data.analysisViewer;
                        }

                    });
                }

                $scope.columnExample = '';
                $scope.$watch('model.configuration.data', function (newValue, oldValue) {
                    for (var key in newValue) {
                        $scope.columnsTable = [];
                        for (var k in newValue[key]) {
                            $scope.columnExample = true;
                            $scope.columnsTable.push({value: k});
                        }
                    }
                }, true);
                $scope.exampleTable = ViewerService.getExampleTable();


            }
        };
    });
});
