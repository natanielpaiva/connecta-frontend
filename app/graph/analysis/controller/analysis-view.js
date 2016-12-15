define([
    'connecta.graph',
    'graph/analysis/service/analysis-service',
    'graph/datasource/service/datasource-service'

], function (graph) {
    return graph.lazy.controller('AnalysisViewController', function ($scope,
            $routeParams, AnalysisService, DatasourceService, $location) {
        if ($routeParams.id) {

            $scope.excluir = function (id) {
                AnalysisService.remove(id).then(function () {
                    $location.path('graph/analysis');
                });
            };

            AnalysisService.getAnalysis($routeParams.id).then(function (response) {
                $scope.types = DatasourceService.getTypes();
                $scope.analysis = response.data;
                $scope.analysisResult = null;

                //SOLR
                if ($scope.analysis.type === $scope.types.SOLR.name) {
                    AnalysisService.execute({
                        analysis: $scope.analysis,
                        pagination: {count: 50, page: 1}

                    }).then(function (response) {
                        $scope.analysisResult = response.data;

                    });

                }
                //database
                if ($scope.analysis.type === $scope.types.DATABASE.name.toUpperCase()) {
                    AnalysisService.execute({
                        analysis: $scope.analysis,
                        pagination: {count: 50, page: 1}

                    }).then(function (response) {
                        $scope.analysisResult = response.data;

                    });
                }
                //webService
                if ($scope.analysis.type === $scope.types.WEBSERVICE.name.toUpperCase()) {

                    if ($scope.analysis.datasource.typeWebservice === "REST") {
                        return AnalysisService.getResulApplyingJson($scope.analysis.datasource.id, $scope.analysis).then(function (response) {
                            $scope.analysisResult = response.data;
                            console.log($scope.analysisResult);
                        });
                    }

                    if ($scope.analysis.datasource.typeWebservice === "SOAP") {
                        return AnalysisService.getResulApplyingXpath($scope.analysis, $scope.analysis.method).then(function (response) {
                            $scope.analysisResult = response.data;
                        });
                    }
                }

                // FIXME consertar esse codigo!!
                if ($scope.analysis.type === "CSV") {
                    AnalysisService.getResultCSV($scope.analysis).then(function (response) {
                        $scope.analysisResult = response.data;
                    });
                }
            });
        }
    });
});
