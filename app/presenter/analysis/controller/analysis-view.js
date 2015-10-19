define([
    'connecta.presenter',
    'presenter/analysis/service/analysis-service',
    'presenter/group/service/group-service',
    'presenter/datasource/service/datasource-service'

], function (presenter) {
    return presenter.lazy.controller('AnalysisViewController', function (
            $scope, $routeParams, AnalysisService, DatasourceService, GroupService) {

        if ($routeParams.id) {

            AnalysisService.getAnalysis($routeParams.id).then(function (response) {
                $scope.types = DatasourceService.getTypes();
                $scope.analysis = response.data;

                $scope.analysisResult = null;

                //SOLR
                if ($scope.analysis.type === $scope.types.SOLR.name) {

                    GroupService.getQueryById($scope.analysis.query.id).
                            success(function (data, status, headers, config) {

                                var query = AnalysisService.formatQueryBuiderEdit(data);
                                $scope.statement = query.statement;

                                $scope.analysis.query = query.statement;

                                return AnalysisService.getSolrResultApplyingQuery(
                                        $scope.analysis.datasource.id,
                                        $scope.statement,
                                        $scope.analysis.facet).then(function (response) {

                                    $scope.analysisResult = response.data;
                                });
                            }).
                            error(function (data, status, headers, config) {

                            });

                }

                if ($scope.analysis.type === $scope.types.DATABASE.name) {
                    //tenho que implementar o método que busca os resultados

                }

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


            });
        }

    });
});
