define([
    'connecta.presenter',
    'presenter/viewer/service/viewer-service'
], function (presenter) {
    return presenter.lazy.controller('ViewerViewController', function ($scope, ViewerService, sidebarService, $routeParams, $location, LayoutService) {

        LayoutService.showSidebarRight(true);
        sidebarService.config({
            controller: function ($scope) {
                $scope.analysisViewer = getAnalysisViewer();
            },
            src: 'app/presenter/viewer/template/_settings.html'
        });
        $scope.$on("$locationChangeStart", function (event) {
            LayoutService.showSidebarRight(false);
            sidebarService.config({
                controller: function () {
                    
                }
            });
        });

        $scope.analysisViewer = {
            "viewer": {
                "name": "",
                "description": ""
            },
            "analysisVwColumn": [],
            "metrics": [],
            "descriptions": [],
            "xfields": [],
            "yfields": [],
            "valueFields": []
        };

        var getPreview = function () {
            if (($scope.analysisViewer.metrics.length > 0) ||
                    ($scope.analysisViewer.xfields.length > 0 &&
                            $scope.analysisViewer.yfields.length > 0)) {
                ViewerService.preview($scope.analysisViewer).then(function (response) {
                    ViewerService.getPreview($scope.analysisViewer, response.data);
                }, function (response) {
                    console.log(response.data);
                });
            }
        };
        
        var getAnalysisViewer = function(){
            return $scope.analysisViewer;
        };

        ViewerService.getAnalysisViewer($routeParams.id).then(function (response) {
            $scope.analysisViewer.viewer.configuration = response.data.viewer.configuration;
            $scope.analysisViewer.viewer.name = response.data.viewer.name;
            $scope.analysisViewer.viewer.description = response.data.viewer.description;
            $scope.analysisViewer.id = response.data.id;
            var analysisColumns = response.data.analysisVwColumn;
            for (var k in analysisColumns) {
                if (analysisColumns[k].type === "METRIC") {
                    $scope.analysisViewer.metrics.push(analysisColumns[k].analysisColumn);
                }
                if (analysisColumns[k].type === "DESCRIPTION") {
                    $scope.analysisViewer.descriptions.push(analysisColumns[k].analysisColumn);
                }
                if (analysisColumns[k].type === "XFIELD") {
                    $scope.analysisViewer.xfields.push(analysisColumns[k].analysisColumn);
                }
                if (analysisColumns[k].type === "YFIELD") {
                    $scope.analysisViewer.yfields.push(analysisColumns[k].analysisColumn);
                }
                if (analysisColumns[k].type === "VALUEFIELD") {
                    $scope.analysisViewer.valueFields.push(analysisColumns[k].analysisColumn);
                }
            }
            $scope.analysisViewer.viewer.configuration = response.data.viewer.configuration;
            getPreview();
        }, function (response) {
            console.log(response.data);
        });

    });
});
