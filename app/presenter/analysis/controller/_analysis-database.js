define([
    'presenter/analysis/service/analysis-service'
], function () {
    return function DatabaseAnalysisFormController($scope, AnalysisService) {

        $scope.analysisColumnsCopy = undefined;

        if($scope.edit && $scope.analysisColumnsCopy === undefined){
            $scope.analysisColumnsCopy = angular.copy($scope.analysis.analysisColumns);
        }

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

                for (var tb in table.connectorColumn) {
                    $scope.analysis.analysisColumns.push({
                        name: table.connectorColumn[tb].name,
                        label: table.connectorColumn[tb].name,
                        formula: table.tableName + "." + table.connectorColumn[tb].name
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
           
            $scope.analysis.analysisColumns = [];

            AnalysisService.execute({
                analysis: $scope.analysis
            }).then(function (response) {
                $scope.responseDataBase = response.data;
                var responseSql = response.data[0];                
                fillAnalysisColumns(responseSql);
                if($scope.analysisColumnsCopy !== undefined &&
                        $scope.analysis.analysisColumns !== undefined){

                    $scope.analysisColumnsCopy.forEach(function(analysisColumn){
                        $scope.analysis.analysisColumns.forEach(function(analysisColumnNew, index){
                            if(analysisColumn.formula === analysisColumnNew.formula){
                                $scope.analysis.analysisColumns[index] = analysisColumn;
                            }
                        });
                    });
                }
            });
        };

        fillAnalysisColumns = function(responseSql){
            for (var formula in responseSql) {
                var name = formula.split(".")[1] || formula;    // Tá com um bug nas de SQL
                $scope.analysis.analysisColumns.push({
                    name: name,
                    label: name,
                    formula: formula
                });
            }
        };

    };
});
