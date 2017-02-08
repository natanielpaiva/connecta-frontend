define([
    'connecta.presenter',
    'presenter/analysis/service/analysis-service',
    'presenter/group/service/group-service',
    'presenter/datasource/service/datasource-service',
    'portal/layout/service/confirm'

], function (presenter) {
    return presenter.lazy.controller('AnalysisViewController', function ($scope,
            $routeParams, AnalysisService, DatasourceService, $confirm, $location) {
        if ($routeParams.id) {

            $scope.excluir = function (id) {
                $confirm('ANALYSIS.DELETE_CONFIRM', 'ANALYSIS.CONFIRM_DELETE').then(function(){
                    AnalysisService.remove(id).then(function () {
                        $location.path('presenter/analysis');
                    });
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
                
                //WSO2
                if ($scope.analysis.type === $scope.types.WSO2.name.toUpperCase()) {
                    AnalysisService.execute({
                        analysis: $scope.analysis,
                        pagination: {count: 50, page: 1}

                    }).then(function (response) {
                        $scope.analysisResult = response.data;

                    });
                }
            });
        }
    });
});
