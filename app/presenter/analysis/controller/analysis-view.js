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
                console.log("$scope.types", $scope.types);
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
                //database
                if ($scope.analysis.type === $scope.types.DATABASE.name.toUpperCase()) {
                    console.log("$scope.analysis", $scope.analysis);
                       AnalysisService.executeSqlDataBase($scope.analysis).then(function (response) {
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
                
                //console.log("$scope.analysis.type", $scope.analysis.type);
              
                //csv tenho que consertar esse codigo!!
                if( $scope.analysis.type === "CSV" ){
                     AnalysisService.getResultCSV($scope.analysis).then(function (response) {
                         $scope.analysisResult = response.data;
                     });
                }

            });
        }

    });
});
