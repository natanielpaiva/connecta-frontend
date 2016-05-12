define([
    'presenter/analysis/service/analysis-service'
], function () {
    return function DatabaseAnalysisFormController($scope, AnalysisService) {

        if (!$scope.analysis.requestType) {
            $scope.analysis.requestType = 'SQL';
        }

        if (!$scope.analysis.selectedTable) {
            $scope.analysis.selectedTable = null;
        }
        
        $scope.$watch('analysis.requestType', function (newValue, oldValue) {

            if (!$scope.edit) { // Só faz sentido na criação de registro
                $scope.analysis.analysisColumns = [];
            }

            if (newValue === "TABLE") {
                var idDataSource = $scope.analysis.datasource.id;
                AnalysisService.getListTableDatasource(idDataSource).then(function (response) {
                    //preenche o select de tabelas do banco de dados
                    $scope.listTableDatasource = response.data;
                });
            }
            if (newValue === "SQL") {
                // Ué
            }
        });

        $scope.$watch('analysis.selectedTable', function (table) {
            if (table !== null) {
                $scope.analysis.table = table.tableName;

                $scope.analysis.analysisColumns = [];

                for (var tb in table.columns) {
                    $scope.analysis.analysisColumns.push({
                        name: table.columns[tb].name,
                        label: table.columns[tb].name,
                        formula: table.tableName + "." + table.columns[tb].name
                    });
                }

                AnalysisService.execute({
                    analysis: $scope.analysis
                }).then(function (response) {
                    $scope.responseDataBase = response.data;
                });
            }
        });

        $scope.requestTypes = AnalysisService.getDatabaseRequestTypes();

        if ($scope.edit) {
            AnalysisService.execute({
                analysis: $scope.analysis
            }).then(function (response) {
                $scope.responseDataBase = response.data;
            });
            
            $scope.component.columns = $scope.analysis.analysisColumns;
        }

        $scope.executeSQL = function () {
            if ( $scope.analysis.requestType === 'SQL' ) {
                $scope.analysis.analysisColumns = [];
            }
            
            AnalysisService.execute({
                analysis: $scope.analysis
            }).then(function (response) {
                $scope.responseDataBase = response.data;
                $scope.analysis.analysisColumns = [];
                for (var formula in response.data[0]) {
                    var name = formula.split(".")[1] || formula;    // Tá com um bug nas de SQL
                    $scope.analysis.analysisColumns.push({
                        name: name,
                        label: name,
                        formula: formula
                    });
                }
            });
        };
    };
});
